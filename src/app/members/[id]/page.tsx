import { getDb } from '@/lib/db/client';
import { members, relationships } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import MemberDetailClient from '@/components/MemberDetailClient'; // 客户端组件

export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const db = getDb();
  const memberResult = await db.select().from(members).where(eq(members.id, params.id)).limit(1);
  if (!memberResult.length) notFound();
  const member = memberResult[0];

  // 获取关系
  const rels = await db
    .select()
    .from(relationships)
    .where(
      or(
        eq(relationships.memberId, member.id),
        eq(relationships.relatedMemberId, member.id)
      )
    );

  // 获取相关成员姓名
  const relatedIds = rels.flatMap(r => [r.memberId, r.relatedMemberId]).filter(id => id !== member.id);
  let relatedMembers: any[] = [];
  if (relatedIds.length) {
    relatedMembers = await db.select().from(members).where(members.id.in(relatedIds));
  }

  const session = await getSession();
  const isAuth = !!session;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{member.name} 的详细信息</h1>
        <Link href="/members" className="text-blue-600">← 返回列表</Link>
      </div>
      <MemberDetailClient
        member={member}
        relationships={rels}
        relatedMembers={relatedMembers}
        isAuth={isAuth}
      />
    </div>
  );
}
