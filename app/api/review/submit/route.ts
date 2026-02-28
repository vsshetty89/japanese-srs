import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { sm2 } from '@/lib/srs/sm2';
import type { SRSCard } from '@/types';

export async function POST(req: NextRequest) {
  const db = getDB();
  const { card_id, quality } = await req.json() as { card_id: number; quality: number };

  if (quality < 0 || quality > 5) {
    return NextResponse.json({ error: 'quality must be 0-5' }, { status: 400 });
  }

  const card = db.prepare('SELECT * FROM srs_cards WHERE id = ?').get(card_id) as SRSCard | undefined;
  if (!card) {
    return NextResponse.json({ error: 'card not found' }, { status: 404 });
  }

  const updated = sm2(card, quality);

  db.prepare(`
    UPDATE srs_cards
    SET repetitions = ?, ease_factor = ?, interval = ?, due_date = ?
    WHERE id = ?
  `).run(updated.repetitions, updated.ease_factor, updated.interval, updated.due_date, card_id);

  db.prepare('INSERT INTO review_log (card_id, quality) VALUES (?, ?)').run(card_id, quality);

  return NextResponse.json({ updated });
}
