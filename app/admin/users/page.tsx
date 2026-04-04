import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getAllUsers, countUsers } from '@/lib/db/users';
import { TopBar } from '@/components/layout/TopBar';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/auth');
  const [users, total] = await Promise.all([getAllUsers({ limit: 50 }), countUsers()]);
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="User Management" subtitle={`${total} total users`} />
      <div className="flex-1 p-6">
        <AdminUsersClient users={users as any[]} total={total} />
      </div>
    </div>
  );
}
