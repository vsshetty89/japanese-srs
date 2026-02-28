import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const db = getDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 80;
  const offset = (page - 1) * limit;

  const kanji = db
    .prepare('SELECT * FROM kanji ORDER BY character ASC LIMIT ? OFFSET ?')
    .all(limit, offset);

  const total = (db.prepare('SELECT COUNT(*) as count FROM kanji').get() as { count: number }).count;

  return NextResponse.json({ kanji, total, page, limit });
}
