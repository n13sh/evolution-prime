import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { TraineeDashboardClient } from '@/components/trainee/dashboard/TraineeDashboardClient';
import { getLatestMetrics } from '@/lib/db/body-metrics';
import { getRecentCompletedSessions } from '@/lib/db/sessions';
import { getPlansForTrainee } from '@/lib/db/workout-plans';
import { getTraineeById } from '@/lib/db/trainees';

export default async function TraineeDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') redirect('/auth');

  const [metrics, recentSessions, plans, traineeProfile] = await Promise.all([
    getLatestMetrics(session.userId),
    getRecentCompletedSessions(session.userId, 7),
    getPlansForTrainee(session.userId),
    getTraineeById(session.userId),
  ]);

  return (
    <TraineeDashboardClient
      user={{ id: session.userId, displayName: session.displayName }}
      metrics={metrics ?? null}
      recentSessions={recentSessions as any[]}
      activePlan={plans[0] ?? null}
      traineeProfile={traineeProfile ?? null}
    />
  );
}
