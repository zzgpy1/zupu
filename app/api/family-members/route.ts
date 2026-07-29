import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getDB } from '@/lib/db';
import { familyMembers, treeMembers, familyTrees } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { treeId, ...memberData } = body;

  const db = getDB();

  // 验证族谱属于当前用户
  const tree = await db
    .select()
    .from(familyTrees)
    .where(and(eq(familyTrees.id, treeId), eq(familyTrees.userId, session.user.id)))
    .get();

  if (!tree) {
    return NextResponse.json({ error: 'Tree not found' }, { status: 404 });
  }

  // 创建成员
  const member = {
    ...memberData,
    userId: session.user.id,
    updatedAt: new Date().toISOString(),
  };

  const result = await db.insert(familyMembers).values(member).returning();

  if (!result || result.length === 0) {
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }

  const newMember = result[0];

  // 关联到族谱
  await db.insert(treeMembers).values({
    treeId,
    memberId: newMember.id,
  });

  return NextResponse.json(newMember);
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const treeId = searchParams.get('treeId');

  const db = getDB();

  let query = db
    .select()
    .from(familyMembers)
    .where(eq(familyMembers.userId, session.user.id));

  if (treeId) {
    // 如果指定了族谱ID，只返回该族谱的成员
    const treeMembersList = await db
      .select({ memberId: treeMembers.memberId })
      .from(treeMembers)
      .where(eq(treeMembers.treeId, treeId));

    const memberIds = treeMembersList.map(t => t.memberId);
    if (memberIds.length > 0) {
      query = db
        .select()
        .from(familyMembers)
        .where(and(eq(familyMembers.userId, session.user.id), sql`id IN (${memberIds.join(',')})`));
    } else {
      return NextResponse.json([]);
    }
  }

  const members = await query.all();
  return NextResponse.json(members);
}
