import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { MessageSquare } from 'lucide-react';

export default async function CoachFeedbackPage() {
  const session = await getSession();
  if (!session || session.role !== 'coach') redirect('/auth');

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Feedback Queue" subtitle="Review and respond to athlete sessions" />
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <GlassCard className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-[--text-muted] mx-auto mb-4" />
          <h3 className="font-semibold text-[--text-primary] mb-2">Feedback Coming Soon</h3>
          <p className="text-sm text-[--text-muted]">The feedback module will allow you to comment on athlete sessions and adjust targets.</p>
        </GlassCard>
      </div>
    </div>
  );
}
