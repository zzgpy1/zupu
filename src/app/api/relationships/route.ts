import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { relationships } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

// POST 创建关系
export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const db = getDb();
    const body = await req.json();
    const newRel = await db.insert(relationships).values(body).returning();
    return NextResponse.json(newRel[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// GET 查询关系（可根据 memberId 或 relatedMemberId）
export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get('memberId');
  const relatedId = searchParams.get('relatedId');

  let condition;
  if (memberId) {
    condition = eq(relationships.memberId, memberId);
  } else if (relatedId) {
    condition = eq(relationships.relatedMemberId, relatedId);
  } else {
    return NextResponse.json([]);
  }

  const result = await db.select().from(relationships).where(condition);
  return NextResponse.json(result);
}
