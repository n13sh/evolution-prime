'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Dumbbell, Calendar, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import type { WorkoutPlan } from '@/types/db';

export function CoachPlansClient({ plans }: { plans: WorkoutPlan[] }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end mb-6">
        <Link href="/coach/plans/new">
          <Button variant="crimson" className="gap-2">
            <Plus className="w-4 h-4" />
            New Plan
          </Button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Plans Yet"
          description="Create your first training plan template to assign to athletes"
          action={
            <Link href="/coach/plans/new">
              <Button variant="crimson" className="gap-2">
                <Plus className="w-4 h-4" /> Create Plan
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((plan, i) => {
            const structure = JSON.parse(plan.structure);
            const totalExercises = structure.days?.reduce((acc: number, d: any) => acc + d.exercises.length, 0) || 0;
            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href={`/coach/plans/${plan.id}`}>
                  <GlassCard hover className="p-5 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex gap-2">
                        {plan.is_ai_generated === 1 && <Badge variant="gold">AI</Badge>}
                        <Badge variant={plan.assigned_to ? 'green' : 'default'}>
                          {plan.assigned_to ? 'Assigned' : 'Template'}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold text-[--text-primary] mb-1">{plan.title}</h3>
                    {plan.description && <p className="text-xs text-[--text-muted] mb-4 line-clamp-2">{plan.description}</p>}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="glass rounded-lg p-2 text-center">
                        <Calendar className="w-3.5 h-3.5 text-[--text-muted] mx-auto mb-1" />
                        <p className="font-medium text-[--text-primary]">{plan.duration_weeks}w</p>
                      </div>
                      <div className="glass rounded-lg p-2 text-center">
                        <Dumbbell className="w-3.5 h-3.5 text-[--text-muted] mx-auto mb-1" />
                        <p className="font-medium text-[--text-primary]">{plan.days_per_week}×/w</p>
                      </div>
                      <div className="glass rounded-lg p-2 text-center">
                        <Users className="w-3.5 h-3.5 text-[--text-muted] mx-auto mb-1" />
                        <p className="font-medium text-[--text-primary]">{totalExercises} ex</p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
