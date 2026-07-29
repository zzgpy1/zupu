import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { DashboardNav } from '@/components/dashboard/nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
