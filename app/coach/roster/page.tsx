import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getCoachTrainees } from '@/lib/db/coaches';
import { TopBar } from '@/components/layout/TopBar';
import { RosterClient } from '@/components/coach/RosterClient';

export default async function RosterPage() {
  const session = await getSession();
  if (!session || session.role !== 'coach') redirect('/auth');
  const trainees = await getCoachTrainees(session.userId);
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="My Athletes" subtitle="Monitor and manage your roster" />
      <div className="flex-1 p-6">
        <RosterClient trainees={trainees as any[]} />
      </div>
    </div>
  );
}
