import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const id = parseInt(params.id);

  const sentence = db.prepare('SELECT id FROM sentences WHERE id = ?').get(id);
  if (!sentence) return NextResponse.json({ error: 'not found' }, { status: 404 });

  db.prepare('DELETE FROM sentences WHERE id = ?').run(id);

  return NextResponse.json({ success: true });
}
