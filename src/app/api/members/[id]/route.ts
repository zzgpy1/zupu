import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { members } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const result = await db.select().from(members).where(eq(members.id, params.id)).limit(1);
  if (!result.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    const db = getDb();
    const body = await req.json();
    const updated = await db
      .update(members)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(members.id, params.id))
      .returning();
    if (!updated.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    const db = getDb();
    const deleted = await db.delete(members).where(eq(members.id, params.id)).returning();
    if (!deleted.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
