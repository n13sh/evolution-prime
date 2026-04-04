import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getAllCoaches } from '@/lib/db/coaches';
import { TopBar } from '@/components/layout/TopBar';
import { AdminCoachesClient } from '@/components/admin/AdminCoachesClient';

export default async function AdminCoachesPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/auth');
  const coaches = await getAllCoaches();
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Coach Management" subtitle="Approve and manage coaches" />
      <div className="flex-1 p-6">
        <AdminCoachesClient coaches={coaches as any[]} />
      </div>
    </div>
  );
}
