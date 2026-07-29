import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getDB } from '@/lib/db';
import { familyMembers, familyTrees } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { MemberList } from '@/components/family-tree/member-list';
import { MemberForm } from '@/components/family-tree/member-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FamilyTreePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/login');

  const db = getDB();

  // 验证族谱属于当前用户
  const tree = await db
    .select()
    .from(familyTrees)
    .where(and(eq(familyTrees.id, id), eq(familyTrees.userId, session.user.id)))
    .get();

  if (!tree) {
    redirect('/');
  }

  // 获取族谱所有成员
  const members = await db
    .select()
    .from(familyMembers)
    .where(eq(familyMembers.userId, session.user.id))
    .all();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{tree.name}</h1>
          <p className="text-muted-foreground">{tree.description}</p>
        </div>
        <MemberForm treeId={id} />
      </div>

      <MemberList members={members} treeId={id} />
    </div>
  );
}
