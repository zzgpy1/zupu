import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { members, families } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

async function getDefaultFamily(db: any) {
  let defaultFamily = await db.select().from(families).where(eq(families.name, '默认家族')).limit(1);
  if (defaultFamily.length === 0) {
    const [newFamily] = await db.insert(families).values({ name: '默认家族' }).returning();
    return newFamily;
  }
  return defaultFamily[0];
}

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const familyId = searchParams.get('familyId');

  let condition;
  if (familyId) {
    condition = eq(members.familyId, familyId);
  } else {
    const defaultFamily = await getDefaultFamily(db);
    condition = eq(members.familyId, defaultFamily.id);
  }

  const result = await db
    .select()
    .from(members)
    .where(condition)
    .orderBy(desc(members.generationIndex), members.sortOrder);

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const db = getDb();
    const body = await req.json();

    let familyId = body.familyId;
    if (!familyId) {
      const defaultFamily = await getDefaultFamily(db);
      familyId = defaultFamily.id;
    }

    const newMember = await db
      .insert(members)
      .values({ ...body, familyId })
      .returning();

    return NextResponse.json(newMember[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
