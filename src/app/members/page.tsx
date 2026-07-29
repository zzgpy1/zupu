import { getDb } from '@/lib/db/client';
import { members, families } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import MemberList from '@/components/MemberList';

async function getDefaultFamily(db: any) {
  let defaultFamily = await db.select().from(families).where(eq(families.name, '默认家族')).limit(1);
  if (defaultFamily.length === 0) {
    const [newFamily] = await db.insert(families).values({ name: '默认家族' }).returning();
    return newFamily;
  }
  return defaultFamily[0];
}

export default async function MembersPage() {
  const db = getDb();
  const defaultFamily = await getDefaultFamily(db);
  const allMembers = await db
    .select()
    .from(members)
    .where(eq(members.familyId, defaultFamily.id))
    .orderBy(desc(members.generationIndex));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">家族成员</h1>
        <Link href="/members/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + 新增成员
        </Link>
      </div>
      <MemberList initialMembers={allMembers} />
    </div>
  );
}
