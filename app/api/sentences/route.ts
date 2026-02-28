import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { tokenize } from '@/lib/kuromoji/tokenizer';
import { extractKanji } from '@/lib/kanji/extract';
import { lookupJisho } from '@/lib/jisho/client';

export async function GET(req: NextRequest) {
  const db = getDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const sentences = db
    .prepare('SELECT * FROM sentences ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .all(limit, offset);

  const total = (db.prepare('SELECT COUNT(*) as count FROM sentences').get() as { count: number }).count;

  return NextResponse.json({ sentences, total, page, limit });
}

export async function POST(req: NextRequest) {
  const db = getDB();
  const body = await req.json();
  const { text, source_tag } = body as { text: string; source_tag?: string };

  if (!text?.trim()) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  const sentenceInsert = db.prepare(
    'INSERT INTO sentences (text, source_tag) VALUES (?, ?)'
  );
  const result = sentenceInsert.run(text.trim(), source_tag ?? null);
  const sentenceId = result.lastInsertRowid as number;

  // Tokenize
  const tokens = await tokenize(text);

  // Upsert vocab
  const vocabUpsert = db.prepare(`
    INSERT INTO vocab (surface_form, basic_form, reading, pos)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(basic_form) DO UPDATE SET surface_form = excluded.surface_form
    RETURNING id
  `);
  const sentenceVocabInsert = db.prepare(
    'INSERT OR IGNORE INTO sentence_vocab (sentence_id, vocab_id) VALUES (?, ?)'
  );
  const srsCardInsert = db.prepare(`
    INSERT OR IGNORE INTO srs_cards (item_type, item_id, card_type)
    VALUES (?, ?, ?)
  `);

  for (const token of tokens) {
    const vocabResult = vocabUpsert.get(
      token.surface_form, token.basic_form, token.reading, token.pos
    ) as { id: number } | undefined;

    if (vocabResult) {
      sentenceVocabInsert.run(sentenceId, vocabResult.id);
      srsCardInsert.run('vocab', vocabResult.id, 'reading');
      srsCardInsert.run('vocab', vocabResult.id, 'meaning');
    }
  }

  // Extract and upsert kanji
  const kanjiChars = extractKanji(text);
  const kanjiInsert = db.prepare(
    'INSERT OR IGNORE INTO kanji (character) VALUES (?)'
  );
  const kanjiSelect = db.prepare('SELECT id FROM kanji WHERE character = ?');
  const sentenceKanjiInsert = db.prepare(
    'INSERT OR IGNORE INTO sentence_kanji (sentence_id, kanji_id) VALUES (?, ?)'
  );

  for (const char of kanjiChars) {
    kanjiInsert.run(char);
    const k = kanjiSelect.get(char) as { id: number };
    sentenceKanjiInsert.run(sentenceId, k.id);
    srsCardInsert.run('kanji', k.id, 'reading');
    srsCardInsert.run('kanji', k.id, 'meaning');
  }

  // Async Jisho lookups (fire and forget, update if no data yet)
  const vocabWithoutData = db
    .prepare('SELECT id, basic_form FROM vocab WHERE jisho_data IS NULL LIMIT 10')
    .all() as { id: number; basic_form: string }[];

  for (const v of vocabWithoutData) {
    lookupJisho(v.basic_form).then(data => {
      if (data) {
        db.prepare('UPDATE vocab SET jisho_data = ? WHERE id = ?')
          .run(JSON.stringify(data), v.id);
      }
    });
  }

  const kanjiWithoutData = db
    .prepare('SELECT id, character FROM kanji WHERE jisho_data IS NULL LIMIT 5')
    .all() as { id: number; character: string }[];

  for (const k of kanjiWithoutData) {
    lookupJisho(k.character).then(data => {
      if (data) {
        db.prepare('UPDATE kanji SET jisho_data = ? WHERE id = ?')
          .run(JSON.stringify(data), k.id);
      }
    });
  }

  const sentence = db.prepare('SELECT * FROM sentences WHERE id = ?').get(sentenceId);
  return NextResponse.json({ sentence, vocab_count: tokens.length, kanji_count: kanjiChars.length }, { status: 201 });
}
