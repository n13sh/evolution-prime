import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getCoachTrainees } from '@/lib/db/coaches';
import { getPlansForCoach } from '@/lib/db/workout-plans';
import { TopBar } from '@/components/layout/TopBar';
import { CoachOverviewClient } from '@/components/coach/CoachOverviewClient';
import { FloatingChat } from '@/components/shared/FloatingChat';

export default async function CoachPage() {
  const session = await getSession();
  if (!session || session.role !== 'coach') redirect('/auth');

  const [trainees, plans] = await Promise.all([
    getCoachTrainees(session.userId),
    getPlansForCoach(session.userId),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Coach Workspace" subtitle={`Welcome back, ${session.displayName}`} />
      <div className="flex-1 p-6">
        <CoachOverviewClient trainees={trainees as any[]} plans={plans} coachId={session.userId} />
      </div>
      <FloatingChat 
        currentUserId={session.userId} 
        partners={trainees.map((t: any) => ({ id: t.id, display_name: t.display_name, role: 'Athlete' }))} 
      />
    </div>
  );
}
