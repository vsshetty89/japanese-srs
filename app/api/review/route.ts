import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDB();
  const now = Math.floor(Date.now() / 1000);

  const cards = db.prepare(`
    SELECT c.*,
      CASE
        WHEN c.item_type = 'vocab' THEN v.surface_form
        WHEN c.item_type = 'kanji' THEN k.character
      END as display,
      CASE
        WHEN c.item_type = 'vocab' THEN v.basic_form
        WHEN c.item_type = 'kanji' THEN k.character
      END as basic_form,
      CASE
        WHEN c.item_type = 'vocab' THEN v.reading
        WHEN c.item_type = 'kanji' THEN k.character
      END as reading,
      CASE
        WHEN c.item_type = 'vocab' THEN v.jisho_data
        WHEN c.item_type = 'kanji' THEN k.jisho_data
      END as jisho_data
    FROM srs_cards c
    LEFT JOIN vocab v ON c.item_type = 'vocab' AND c.item_id = v.id
    LEFT JOIN kanji k ON c.item_type = 'kanji' AND c.item_id = k.id
    WHERE c.due_date <= ?
    ORDER BY c.due_date ASC
    LIMIT 50
  `).all(now);

  const total_due = (db.prepare(
    'SELECT COUNT(*) as count FROM srs_cards WHERE due_date <= ?'
  ).get(now) as { count: number }).count;

  return NextResponse.json({ cards, total_due });
}
