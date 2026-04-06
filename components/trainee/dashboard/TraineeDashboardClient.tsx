'use client';
import { motion } from 'framer-motion';
import { Dumbbell, Flame, Target, TrendingUp, Calendar, Zap, ArrowRight, Trophy, Brain, Sparkles, ShieldCheck, Crown, Star, ChevronUp } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { ProgressRing } from './ProgressRing';
import { MetricCard } from './MetricCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRelative, calcBMI, bmiCategory } from '@/lib/utils/format';
import Link from 'next/link';
import type { BodyMetric, Trainee, WorkoutPlan } from '@/types/db';

interface Props {
  user: { id: number; displayName: string };
  metrics: BodyMetric | null;
  recentSessions: any[];
  activePlan: WorkoutPlan | null;
  traineeProfile: Trainee | null;
  planType: 'free' | 'moderate' | 'pro';
  isSubscribed: boolean;
}

const PLAN_CONFIG = {
  free: {
    label: 'Essential',
    color: 'text-[--text-muted]',
    bg: 'bg-white/5',
    border: 'border-white/10',
    icon: Star,
    desc: 'Basic access — upgrade to unlock AI plans, diet & chat',
    nextPlan: 'Moderate',
    nextHref: '/plans',
  },
  moderate: {
    label: 'Elite',
    color: 'text-gold',
    bg: 'bg-gold/5',
    border: 'border-gold/20',
    icon: Crown,
    desc: 'AI Architect & Coach Chat enabled — go Pro for maximum gains',
    nextPlan: 'Pro',
    nextHref: '/plans',
  },
  pro: {
    label: 'Pro',
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    icon: Trophy,
    desc: 'Maximum evolution — all features unlocked',
    nextPlan: null,
    nextHref: null,
  },
};

export function TraineeDashboardClient({ 
  user, metrics, recentSessions, activePlan, traineeProfile, planType, isSubscribed 
}: Props) {
  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = today.getDay();

  const isFree = planType === 'free';
  const plan = PLAN_CONFIG[planType];
  const PlanIcon = plan.icon;

  // Progress calculations
  const calorieProgress = 78;
  const proteinProgress = 92;
  const workoutProgress = recentSessions.length > 0 ? Math.min(100, (recentSessions.length / 4) * 100) : 0;

  const bmi = metrics?.weight_kg && traineeProfile?.height_cm
    ? calcBMI(metrics.weight_kg, traineeProfile.height_cm)
    : null;

  const planStructure = activePlan ? JSON.parse(activePlan.structure) : null;
  const nextDay = planStructure?.days?.[recentSessions.length % (planStructure?.days?.length || 1)];

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title={`Good ${today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening'}, ${user.displayName.split(' ')[0]}`}
        subtitle={today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      />

      <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6 md:space-y-8">
        
        {/* ── Subscription Status Card ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${plan.bg} border ${plan.border} rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${plan.bg} border ${plan.border} flex items-center justify-center shrink-0`}>
              <PlanIcon className={`w-5 h-5 ${plan.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={`text-[10px] font-black uppercase tracking-widest ${plan.color}`}>
                  {plan.label} Plan
                </p>
                {planType === 'pro' && (
                  <span className="text-[8px] font-black uppercase tracking-widest bg-gold text-black px-2 py-0.5 rounded-full">ACTIVE</span>
                )}
              </div>
              <p className="text-xs text-[--text-muted] font-medium mt-0.5 hidden sm:block">{plan.desc}</p>
            </div>
          </div>
          {plan.nextHref && (
            <Link href={plan.nextHref} className="shrink-0">
              <Button variant="ghost" className={`h-10 border ${plan.border} ${plan.color} text-[10px] font-black uppercase tracking-widest px-5 gap-2`}>
                <ChevronUp className="w-3 h-3" />
                Upgrade
              </Button>
            </Link>
          )}
        </motion.div>

        {/* ── Hero Progress ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard glow="gold" className="relative overflow-hidden border-gold/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(245,197,24,0.08),transparent)]" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-[--text-primary] tracking-tight">Today&apos;s Progress</h2>
                  <p className="text-sm text-[--text-muted] font-medium mt-1">Keep pushing — excellence is a habit.</p>
                </div>
                <Badge variant="gold" className="self-start sm:self-center px-4 py-1 text-sm shadow-lg shadow-gold/10">
                  <Flame className="w-4 h-4 mr-1.5 inline fill-current" />
                  {recentSessions.length} DAY STREAK
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 justify-items-center">
                <ProgressRing value={calorieProgress} color="#F5C518" label="Calories" sublabel="1,540 / 2,000" icon={<Flame className="w-5 h-5 text-gold" />} />
                <ProgressRing value={proteinProgress} color="#DC143C" label="Protein" sublabel="165g / 180g" icon={<Zap className="w-5 h-5 text-crimson" />} />
                <ProgressRing value={workoutProgress} color="#6366f1" label="Workouts" sublabel={`${recentSessions.length} / 4 this week`} icon={<Dumbbell className="w-5 h-5 text-indigo-400" />} />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MetricCard icon={TrendingUp} iconColor="#F5C518" label="Current Weight" value={metrics?.weight_kg?.toFixed(1) ?? '--'} unit="kg" sublabel="Latest measurement" />
          <MetricCard icon={Target} iconColor="#DC143C" label="BMI" value={bmi?.toFixed(1) ?? '--'} sublabel={bmi ? bmiCategory(bmi) : 'Log metrics'} />
          <MetricCard icon={Dumbbell} iconColor="#6366f1" label="Total Sessions" value={recentSessions.length} unit="this week" sublabel="Keep it up!" />
          <MetricCard icon={Trophy} iconColor="#22c55e" label="Active Plan" value={activePlan ? '1' : '0'} sublabel={activePlan?.title ?? 'No plan assigned'} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* ── Weekly Heatmap ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            <GlassCard className="h-full border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display font-black text-xl text-[--text-primary] tracking-tight uppercase">Performance Log</h3>
                <Calendar className="w-5 h-5 text-[--text-muted]" />
              </div>
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                {weekDays.map((day, i) => {
                  const isToday = i === todayIndex;
                  const hasWorkout = recentSessions.some((s: any) => {
                    const d = new Date((s.completed_at || s.started_at) * 1000).getDay();
                    return d === i;
                  });
                  return (
                    <div key={day} className="flex flex-col items-center gap-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isToday ? 'text-gold' : 'text-[--text-muted]/60'}`}>{day}</span>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-500 hover:scale-110 ${
                        hasWorkout ? 'bg-gold/20 border border-gold/40 shadow-[0_0_15px_rgba(245,197,24,0.15)]'
                        : isToday ? 'glass border border-gold/30'
                        : 'bg-white/3 border border-white/5'
                      }`}>
                        {hasWorkout && <Dumbbell className="w-4 h-4 text-gold" />}
                        {!hasWorkout && isToday && <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              {recentSessions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-[--text-muted]/40 uppercase tracking-[0.2em] mb-5">Recent History</p>
                  <div className="space-y-4">
                    {recentSessions.slice(0, 3).map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between group hover:translate-x-1 transition-transform">
                        <div className="flex items-center gap-4">
                          <div className="w-1.5 h-6 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                          <div>
                            <span className="text-sm font-black text-[--text-primary] block tracking-tight">{s.plan_title || 'Free Session'}</span>
                            <span className="text-[10px] text-[--text-muted]/60 font-bold uppercase tracking-wide">Elite Training</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest bg-white/3 px-3 py-1 rounded-lg">
                          {formatRelative(s.completed_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* ── Quick Actions / Next Workout ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="h-full flex flex-col border-white/5">
              <h3 className="font-display font-black text-xl text-[--text-primary] tracking-tight uppercase mb-6">Quick Access</h3>
              
              {/* AI Architect */}
              <div className={`relative rounded-2xl p-4 mb-3 border transition-all ${isFree ? 'bg-white/3 border-white/5 opacity-70' : 'bg-gold/5 border-gold/20'}`}>
                {isFree && (
                  <div className="absolute top-2 right-2">
                    <ShieldCheck className="w-4 h-4 text-gold/40" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <Brain className={`w-5 h-5 ${isFree ? 'text-[--text-muted]/40' : 'text-gold'}`} />
                  <p className="text-xs font-black uppercase tracking-widest text-[--text-primary]">AI Architect</p>
                </div>
                <p className="text-[10px] text-[--text-muted] mb-3">
                  {isFree ? 'Upgrade to generate custom AI workout + diet plans' : 'Generate your personalized AI plan'}
                </p>
                <Link href={isFree ? '/plans' : '/trainee/architect'}>
                  <Button variant={isFree ? 'ghost' : 'primary'} className="w-full h-10 text-[10px] font-black uppercase tracking-widest">
                    {isFree ? 'Unlock with Elite' : 'Open Architect'}
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Diet Plan */}
              <div className={`relative rounded-2xl p-4 mb-3 border transition-all ${isFree ? 'bg-white/3 border-white/5 opacity-70' : 'bg-white/3 border-white/5'}`}>
                {isFree && <div className="absolute top-2 right-2"><ShieldCheck className="w-4 h-4 text-gold/40" /></div>}
                <div className="flex items-center gap-3 mb-2">
                  <Zap className={`w-5 h-5 ${isFree ? 'text-[--text-muted]/40' : 'text-crimson'}`} />
                  <p className="text-xs font-black uppercase tracking-widest text-[--text-primary]">Nutrition Vault</p>
                </div>
                <p className="text-[10px] text-[--text-muted] mb-3">
                  {isFree ? 'Upgrade to access your personalized diet plan' : 'View your AI-generated macro plan'}
                </p>
                <Link href={isFree ? '/plans' : '/trainee/vault'}>
                  <Button variant="ghost" className="w-full h-10 text-[10px] font-black uppercase tracking-widest border-white/10">
                    {isFree ? 'Upgrade to Access' : 'View Diet Plan'}
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Progress Vault */}
              <div className="rounded-2xl p-4 border bg-white/3 border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <p className="text-xs font-black uppercase tracking-widest text-[--text-primary]">Progress Vault</p>
                </div>
                <p className="text-[10px] text-[--text-muted] mb-3">Track your body metrics and performance history</p>
                <Link href="/trainee/vault">
                  <Button variant="ghost" className="w-full h-10 text-[10px] font-black uppercase tracking-widest border-white/10">
                    Open Vault
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ── Diet Plan Section (paid only) ── */}
        {!isFree && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-black text-xl text-[--text-primary] tracking-tight uppercase">Nutrition Plan</h3>
                <Link href="/trainee/architect" className="text-[10px] font-black text-gold hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group">
                  Regenerate <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              {activePlan ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Calories', value: '2,200', unit: 'kcal', color: '#F5C518' },
                    { label: 'Protein', value: '180', unit: 'g', color: '#DC143C' },
                    { label: 'Carbs', value: '240', unit: 'g', color: '#6366f1' },
                    { label: 'Fat', value: '70', unit: 'g', color: '#22c55e' },
                  ].map(m => (
                    <div key={m.label} className="bg-white/3 border border-white/5 rounded-2xl p-5 text-center hover:bg-white/5 transition-all">
                      <div className="font-display font-black text-2xl tracking-tighter" style={{ color: m.color }}>{m.value}</div>
                      <div className="text-[10px] text-[--text-muted] mt-1 uppercase tracking-widest">{m.label} <span className="text-[8px]">/ day</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="w-12 h-12 text-gold/20 mb-4" />
                  <p className="text-sm font-black text-[--text-muted] mb-4">No plan generated yet.</p>
                  <Link href="/trainee/architect">
                    <Button variant="primary" className="h-12 px-8 text-[10px] font-black uppercase tracking-widest">
                      Launch AI Architect <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* ── Body Metrics Preview ── */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassCard className="border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-black text-xl text-[--text-primary] tracking-tight uppercase">Biometric Vault</h3>
                <Link href="/trainee/vault" className="text-[10px] font-black text-gold hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group">
                  Full Analytics <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'WEIGHT', value: metrics.weight_kg ? `${metrics.weight_kg}kg` : '--' },
                  { label: 'BODY FAT', value: metrics.body_fat_pct ? `${metrics.body_fat_pct}%` : '--' },
                  { label: 'WAIST', value: metrics.waist_cm ? `${metrics.waist_cm}cm` : '--' },
                  { label: 'BICEP', value: metrics.bicep_cm ? `${metrics.bicep_cm}cm` : '--' },
                ].map(m => (
                  <div key={m.label} className="bg-white/3 group hover:bg-white/5 border border-white/5 rounded-2xl p-5 text-center transition-all duration-300 cursor-default">
                    <div className="font-display font-black text-2xl md:text-3xl text-[--text-primary] group-hover:scale-105 transition-transform tracking-tighter">{m.value}</div>
                    <div className="text-[10px] font-black text-[--text-muted]/40 mt-2 tracking-[0.2em] uppercase">{m.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
