import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getMetricsHistory } from '@/lib/db/body-metrics';
import { getPersonalRecords, getVolumeByMuscle, getWeeklyVolume } from '@/lib/db/workout-logs';
import { getSessionsForTrainee } from '@/lib/db/sessions';
import { VaultClient } from '@/components/trainee/vault/VaultClient';
import { TopBar } from '@/components/layout/TopBar';

export default async function VaultPage() {
  const session = await getSession();
  if (!session || session.role !== 'trainee') redirect('/auth');

  const [metrics, prs, muscleVolume, weeklyVolume, sessions] = await Promise.all([
    getMetricsHistory(session.userId),
    getPersonalRecords(session.userId),
    getVolumeByMuscle(session.userId, 30),
    getWeeklyVolume(session.userId, 8),
    getSessionsForTrainee(session.userId, 50),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Progress Vault" subtitle="Your complete performance history" />
      <div className="flex-1 p-6">
        <VaultClient
          metrics={metrics}
          prs={prs as any[]}
          muscleVolume={muscleVolume as any[]}
          weeklyVolume={weeklyVolume as any[]}
          sessions={sessions as any[]}
          traineeId={session.userId}
        />
      </div>
    </div>
  );
}
