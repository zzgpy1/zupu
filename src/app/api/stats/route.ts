import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { members } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  const db = getDb();
  const total = await db.select({ count: sql<number>`count(*)` }).from(members);
  const generations = await db
    .select({ gen: members.generationIndex, count: sql<number>`count(*)` })
    .from(members)
    .groupBy(members.generationIndex)
    .orderBy(members.generationIndex);

  return NextResponse.json({
    total: total[0]?.count || 0,
    generations: generations.filter(g => g.gen !== null),
  });
}
