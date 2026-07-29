import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDB } from '@/lib/db';
import { familyMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const db = getDB();

  // 验证成员属于当前用户
  const existing = await db
    .select()
    .from(familyMembers)
    .where(and(eq(familyMembers.id, id), eq(familyMembers.userId, session.user.id)))
    .get();

  if (!existing) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  const result = await db
    .update(familyMembers)
    .set({
      ...body,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(familyMembers.id, id))
    .returning();

  return NextResponse.json(result[0]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDB();

  // 验证成员属于当前用户
  const existing = await db
    .select()
    .from(familyMembers)
    .where(and(eq(familyMembers.id, id), eq(familyMembers.userId, session.user.id)))
    .get();

  if (!existing) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  await db.delete(familyMembers).where(eq(familyMembers.id, id));
  return NextResponse.json({ success: true });
}
