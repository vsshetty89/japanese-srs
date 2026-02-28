import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const db = getDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 50;
  const offset = (page - 1) * limit;

  const vocab = db
    .prepare('SELECT * FROM vocab ORDER BY basic_form ASC LIMIT ? OFFSET ?')
    .all(limit, offset);

  const total = (db.prepare('SELECT COUNT(*) as count FROM vocab').get() as { count: number }).count;

  return NextResponse.json({ vocab, total, page, limit });
}
