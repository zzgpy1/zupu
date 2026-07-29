import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getDB } from '@/lib/db';
import { familyTrees, familyMembers } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { FamilyTreeCard } from '@/components/family-tree/tree-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const db = getDB();
  
  // 查询当前用户的所有族谱
  const trees = await db
    .select({
      id: familyTrees.id,
      name: familyTrees.name,
      description: familyTrees.description,
      memberCount: count(familyMembers.id),
      createdAt: familyTrees.createdAt,
    })
    .from(familyTrees)
    .leftJoin(treeMembers, eq(familyTrees.id, treeMembers.treeId))
    .leftJoin(familyMembers, eq(treeMembers.memberId, familyMembers.id))
    .where(eq(familyTrees.userId, session.user.id))
    .groupBy(familyTrees.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">我的族谱</h1>
          <p className="text-muted-foreground">管理您的家族成员和族谱树</p>
        </div>
        <Link href="/family-tree/new">
          <Button>新建族谱</Button>
        </Link>
      </div>

      {trees.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">还没有族谱，点击上方按钮创建第一个族谱</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trees.map((tree) => (
            <FamilyTreeCard key={tree.id} tree={tree} />
          ))}
        </div>
      )}
    </div>
  );
}
