import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const vocab = db.prepare('SELECT * FROM vocab WHERE id = ?').get(parseInt(params.id));

  if (!vocab) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const card_reading = db.prepare(
    "SELECT * FROM srs_cards WHERE item_type = 'vocab' AND item_id = ? AND card_type = 'reading'"
  ).get(parseInt(params.id));
  const card_meaning = db.prepare(
    "SELECT * FROM srs_cards WHERE item_type = 'vocab' AND item_id = ? AND card_type = 'meaning'"
  ).get(parseInt(params.id));

  const sentences = db.prepare(`
    SELECT s.* FROM sentences s
    JOIN sentence_vocab sv ON sv.sentence_id = s.id
    WHERE sv.vocab_id = ?
    ORDER BY s.created_at DESC LIMIT 5
  `).all(parseInt(params.id));

  return NextResponse.json({ vocab, cards: { reading: card_reading, meaning: card_meaning }, sentences });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const id = parseInt(params.id);
  const vocab = db.prepare('SELECT id FROM vocab WHERE id = ?').get(id);
  if (!vocab) return NextResponse.json({ error: 'not found' }, { status: 404 });
  db.prepare('DELETE FROM vocab WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
