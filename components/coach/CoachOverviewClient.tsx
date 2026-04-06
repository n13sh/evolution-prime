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
    <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12 p-4 md:p-8">
      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { icon: Users, color: '#DC143C', label: 'TOTAL ATHLETES', value: trainees.length },
          { icon: CheckCircle, color: '#22c55e', label: 'ACTIVE THIS WEEK', value: activeTrainees.length },
          { icon: AlertCircle, color: '#f97316', label: 'NEEDS ATTENTION', value: inactiveTrainees.length },
          { icon: BookOpen, color: '#6366f1', label: 'TRAINING PLANS', value: plans.length },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 transition-all duration-500 hover:scale-105 group border-white/5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/40 group-hover:rotate-6 transition-transform" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div className="font-display font-black text-4xl text-[--text-primary] tracking-tight">{stat.value}</div>
            <div className="text-[10px] font-black text-[--text-muted]/60 mt-2 uppercase tracking-[0.2em]">{stat.label}</div>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trainee roster preview */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-8 h-full border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <h3 className="font-display font-black text-2xl text-[--text-primary] tracking-tight uppercase italic">Elite Roster</h3>
              <Link href="/coach/roster">
                <Button variant="ghost" size="sm" className="gap-2 text-[10px] uppercase font-black tracking-widest px-4">
                  View Roster <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            {trainees.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto border border-white/5">
                  <Users className="w-10 h-10 text-[--text-muted]/20" />
                </div>
                <p className="text-sm font-black text-[--text-muted]/40 uppercase tracking-widest">No athletes assigned yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trainees.slice(0, 6).map(t => {
                  const isActive = t.last_workout && (Date.now() / 1000 - t.last_workout) < 7 * 86400;
                  return (
                    <Link key={t.id} href={`/coach/roster/${t.id}`} className="block group">
                      <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 group-hover:bg-white/5 group-hover:border-white/10 transition-all duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-crimson/10 flex items-center justify-center shrink-0 border border-crimson/20 group-hover:scale-110 transition-transform">
                          <span className="text-lg font-black text-crimson-light">{t.display_name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-black text-[--text-primary] truncate tracking-tight uppercase">{t.display_name}</p>
                          <p className="text-[10px] font-bold text-[--text-muted]/60 uppercase tracking-wide">
                            {t.last_workout ? `LAST SEEN: ${formatRelative(t.last_workout)}` : 'INITIATING EVOLUTION...'}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full shrink-0 shadow-lg ${isActive ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Plan library preview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-8 h-full border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <h3 className="font-display font-black text-2xl text-[--text-primary] tracking-tight uppercase italic">Architect Vault</h3>
              <Link href="/coach/plans">
                <Button variant="ghost" size="sm" className="gap-2 text-[10px] uppercase font-black tracking-widest px-4">
                  View Library <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            {plans.length === 0 ? (
              <div className="text-center py-12 space-y-8">
                 <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto border border-white/5">
                    <BookOpen className="w-10 h-10 text-[--text-muted]/20" />
                 </div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-[--text-muted]/40 uppercase tracking-widest">No plans in vault</p>
                </div>
                <Link href="/coach/plans/new">
                  <Button variant="crimson" size="sm" className="h-12 px-8 text-xs font-black uppercase tracking-widest shadow-xl shadow-crimson/10">Deploy New Plan</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {plans.slice(0, 5).map(plan => (
                  <Link key={plan.id} href={`/coach/plans/${plan.id}`} className="block group">
                    <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 group-hover:bg-white/5 group-hover:border-white/10 transition-all duration-300">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Dumbbell className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-black text-[--text-primary] truncate tracking-tight uppercase">{plan.title}</p>
                        <p className="text-[10px] font-bold text-[--text-muted]/60 uppercase tracking-wide">
                          {plan.days_per_week} DAYS/WEEK · {plan.duration_weeks} WEEKS
                        </p>
                      </div>
                      <Badge variant={plan.assigned_to ? 'green' : 'default'} className="px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                        {plan.assigned_to ? 'DEPLOYED' : 'TEMPLATE'}
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
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard glow="crimson" className="p-8 border-crimson/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-crimson/10 flex items-center justify-center border border-crimson/20">
                <AlertCircle className="w-6 h-6 text-crimson-light" />
              </div>
              <h3 className="font-display font-black text-xl text-[--text-primary] tracking-tight uppercase italic">Critical Status Updates</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveTrainees.map(t => (
                <Link key={t.id} href={`/coach/roster/${t.id}`} className="group">
                  <div className="glass p-5 rounded-2xl border border-white/5 group-hover:bg-crimson/5 group-hover:border-crimson/20 transition-all">
                    <p className="text-base font-black text-[--text-primary] tracking-tight uppercase truncate">{t.display_name}</p>
                    <p className="text-[10px] font-black text-crimson-light/80 mt-1 uppercase tracking-widest">ZERO ACTIVITY DETECTED</p>
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
