'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, BookOpen, ArrowRight, Dumbbell, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelative } from '@/lib/utils/format';
import type { WorkoutPlan } from '@/types/db';

interface Props {
  trainees: any[];
  plans: WorkoutPlan[];
  coachId: number;
}

export function CoachOverviewClient({ trainees, plans }: Props) {
  const activeTrainees = trainees.filter(t => t.last_workout);
  const inactiveTrainees = trainees.filter(t => !t.last_workout);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, color: '#DC143C', label: 'Total Athletes', value: trainees.length },
          { icon: CheckCircle, color: '#22c55e', label: 'Active This Week', value: activeTrainees.length },
          { icon: AlertCircle, color: '#f97316', label: 'Need Attention', value: inactiveTrainees.length },
          { icon: BookOpen, color: '#6366f1', label: 'Training Plans', value: plans.length },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}18` }}>
              <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
            </div>
            <div className="font-display font-bold text-2xl text-[--text-primary]">{stat.value}</div>
            <div className="text-xs text-[--text-muted] mt-1">{stat.label}</div>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trainee roster preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[--text-primary]">My Athletes</h3>
              <Link href="/coach/roster">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            {trainees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-[--text-muted] mx-auto mb-3" />
                <p className="text-sm text-[--text-muted]">No athletes assigned yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {trainees.slice(0, 6).map(t => {
                  const isActive = t.last_workout && (Date.now() / 1000 - t.last_workout) < 7 * 86400;
                  return (
                    <Link key={t.id} href={`/coach/roster/${t.id}`}>
                      <div className="flex items-center gap-3 p-3 glass-hover rounded-xl transition-all">
                        <div className="w-9 h-9 rounded-full bg-crimson/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-crimson-light">{t.display_name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[--text-primary] truncate">{t.display_name}</p>
                          <p className="text-xs text-[--text-muted]">{t.last_workout ? formatRelative(t.last_workout) : 'No sessions yet'}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Plan library preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[--text-primary]">Plan Library</h3>
              <Link href="/coach/plans">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            {plans.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 text-[--text-muted] mx-auto mb-3" />
                <p className="text-sm text-[--text-muted] mb-4">No plans created yet</p>
                <Link href="/coach/plans/new">
                  <Button variant="crimson" size="sm">Create First Plan</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {plans.slice(0, 5).map(plan => (
                  <Link key={plan.id} href={`/coach/plans/${plan.id}`}>
                    <div className="flex items-center gap-3 p-3 glass-hover rounded-xl transition-all">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[--text-primary] truncate">{plan.title}</p>
                        <p className="text-xs text-[--text-muted]">{plan.days_per_week}x/week · {plan.duration_weeks} weeks</p>
                      </div>
                      <Badge variant={plan.assigned_to ? 'green' : 'default'}>
                        {plan.assigned_to ? 'Assigned' : 'Template'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Attention needed */}
      {inactiveTrainees.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard glow="crimson" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-crimson-light" />
              <h3 className="font-semibold text-[--text-primary]">Athletes Needing Attention</h3>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {inactiveTrainees.map(t => (
                <Link key={t.id} href={`/coach/roster/${t.id}`}>
                  <div className="glass p-3 rounded-xl hover:bg-white/5 transition-all">
                    <p className="text-sm font-semibold text-[--text-primary]">{t.display_name}</p>
                    <p className="text-xs text-crimson-light mt-0.5">No recent workouts</p>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
