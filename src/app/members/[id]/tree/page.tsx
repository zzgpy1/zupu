import { getDb } from '@/lib/db/client';
import { members, relationships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import TreeView from '@/components/TreeView';

export default async function MemberTreePage({ params }: { params: { id: string } }) {
  const db = getDb();
  const member = await db.select().from(members).where(eq(members.id, params.id)).limit(1);
  if (!member.length) return <div>成员不存在</div>;
  const root = member[0];

  const childrenRels = await db
    .select()
    .from(relationships)
    .where(
      and(
        eq(relationships.relatedMemberId, root.id),
        eq(relationships.relationType, 'child')
      )
    );
  const childIds = childrenRels.map(r => r.memberId);
  let children: any[] = [];
  if (childIds.length) {
    children = await db.select().from(members).where(members.id.in(childIds));
  }

  const treeData = {
    id: root.id,
    name: root.name,
    children: children.map(c => ({ id: c.id, name: c.name, children: [] })),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{root.name} 的家族树</h1>
      <TreeView data={treeData} />
    </div>
  );
}
