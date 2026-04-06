import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { TraineeDashboardClient } from '@/components/trainee/dashboard/TraineeDashboardClient';
import { getLatestMetrics } from '@/lib/db/body-metrics';
import { getRecentCompletedSessions } from '@/lib/db/sessions';
import { getPlansForTrainee } from '@/lib/db/workout-plans';
import { getTraineeById } from '@/lib/db/trainees';
import { getSubscriptionByUserId } from '@/lib/db/subscriptions';
import { getAllCoaches } from '@/lib/db/coaches';
import { FloatingChat } from '@/components/shared/FloatingChat';

export default async function TraineeDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') redirect('/auth');

  // Get subscription status
  const subscription = await getSubscriptionByUserId(session.userId);
  const planType = subscription?.plan_type || 'free';
  const isActive = subscription?.status === 'active';

  // Only redirect if they are completely unverified or have no baseline access? 
  // For now, everyone has 'free' access after migration.

  const [metrics, recentSessions, plans, traineeProfile, coaches] = await Promise.all([
    getLatestMetrics(session.userId),
    getRecentCompletedSessions(session.userId, 7),
    getPlansForTrainee(session.userId),
    getTraineeById(session.userId),
    getAllCoaches()
  ]);

  return (
    <>
      <TraineeDashboardClient
        user={{ id: session.userId, displayName: session.displayName }}
        metrics={metrics ?? null}
        recentSessions={recentSessions as any[]}
        activePlan={plans[0] ?? null}
        traineeProfile={traineeProfile ?? null}
        planType={planType}
        isSubscribed={isActive}
      />
      <FloatingChat 
        currentUserId={session.userId} 
        partners={coaches.map((c: any) => ({ id: c.id, display_name: c.display_name, role: 'Coach' }))} 
        planType={planType}
      />
    </>
  );
}
