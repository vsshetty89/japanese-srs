import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDB();
  const now = Math.floor(Date.now() / 1000);

  const sentences = (db.prepare('SELECT COUNT(*) as count FROM sentences').get() as { count: number }).count;
  const vocab = (db.prepare('SELECT COUNT(*) as count FROM vocab').get() as { count: number }).count;
  const kanji = (db.prepare('SELECT COUNT(*) as count FROM kanji').get() as { count: number }).count;
  const due_today = (db.prepare('SELECT COUNT(*) as count FROM srs_cards WHERE due_date <= ?').get(now) as { count: number }).count;
  const total_cards = (db.prepare('SELECT COUNT(*) as count FROM srs_cards').get() as { count: number }).count;

  return NextResponse.json({ sentences, vocab, kanji, due_today, total_cards });
}
