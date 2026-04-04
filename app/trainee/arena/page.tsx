import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getPlansForTrainee } from '@/lib/db/workout-plans';
import { getActiveSession } from '@/lib/db/sessions';
import { ArenaClient } from '@/components/trainee/arena/ArenaClient';
import { TopBar } from '@/components/layout/TopBar';

export default async function ArenaPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') redirect('/auth');

  const [plans, activeSession] = await Promise.all([
    getPlansForTrainee(session.userId),
    getActiveSession(session.userId),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="The Arena" subtitle="Your workout starts here" />
      <div className="flex-1 p-6">
        <ArenaClient plans={plans} activeSession={activeSession ?? null} traineeId={session.userId} />
      </div>
    </div>
  );
}
