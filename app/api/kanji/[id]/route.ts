import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const kanji = db.prepare('SELECT * FROM kanji WHERE id = ?').get(parseInt(params.id));

  if (!kanji) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const card_reading = db.prepare(
    "SELECT * FROM srs_cards WHERE item_type = 'kanji' AND item_id = ? AND card_type = 'reading'"
  ).get(parseInt(params.id));
  const card_meaning = db.prepare(
    "SELECT * FROM srs_cards WHERE item_type = 'kanji' AND item_id = ? AND card_type = 'meaning'"
  ).get(parseInt(params.id));

  const sentences = db.prepare(`
    SELECT s.* FROM sentences s
    JOIN sentence_kanji sk ON sk.sentence_id = s.id
    WHERE sk.kanji_id = ?
    ORDER BY s.created_at DESC LIMIT 5
  `).all(parseInt(params.id));

  return NextResponse.json({ kanji, cards: { reading: card_reading, meaning: card_meaning }, sentences });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const id = parseInt(params.id);
  const kanji = db.prepare('SELECT id FROM kanji WHERE id = ?').get(id);
  if (!kanji) return NextResponse.json({ error: 'not found' }, { status: 404 });
  db.prepare('DELETE FROM kanji WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
