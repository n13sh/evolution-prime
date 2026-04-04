import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getPlansForCoach } from '@/lib/db/workout-plans';
import { TopBar } from '@/components/layout/TopBar';
import { CoachPlansClient } from '@/components/coach/CoachPlansClient';

export default async function CoachPlansPage() {
  const session = await getSession();
  if (!session || session.role !== 'coach') redirect('/auth');
  const plans = await getPlansForCoach(session.userId);
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Plan Library" subtitle="Create and manage training templates" />
      <div className="flex-1 p-6">
        <CoachPlansClient plans={plans} />
      </div>
    </div>
  );
}
