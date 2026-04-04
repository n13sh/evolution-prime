import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { countUsers, getAllUsers } from '@/lib/db/users';
import { getAllCoaches } from '@/lib/db/coaches';
import { TopBar } from '@/components/layout/TopBar';
import { AdminOverviewClient } from '@/components/admin/AdminOverviewClient';

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/auth');

  const [totalUsers, totalTrainees, totalCoaches, recentUsers, coaches] = await Promise.all([
    countUsers(),
    countUsers({ role: 'trainee' }),
    countUsers({ role: 'coach' }),
    getAllUsers({ limit: 10 }),
    getAllCoaches(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Elite Admin Hub" subtitle="Platform overview and controls" />
      <div className="flex-1 p-6">
        <AdminOverviewClient
          stats={{ totalUsers, totalTrainees, totalCoaches }}
          recentUsers={recentUsers as any[]}
          coaches={coaches as any[]}
        />
      </div>
    </div>
  );
}
