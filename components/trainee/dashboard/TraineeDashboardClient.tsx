'use client';
import { motion } from 'framer-motion';
import { Dumbbell, Flame, Target, TrendingUp, Calendar, Zap, ArrowRight, Trophy, Brain, Sparkles, ShieldCheck } from 'lucide-react';
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

export function TraineeDashboardClient({ 
  user, metrics, recentSessions, activePlan, traineeProfile, planType, isSubscribed 
}: Props) {
  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = today.getDay();

  const isFree = planType === 'free';

  // Mock progress for demo (would be real data)
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

      <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6 md:space-y-10">
        
        {/* Tier Indicator */}
        {isFree && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/3 border border-white/5 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[--text-muted]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[--text-muted]">Evolution Path: Essential</p>
                <p className="text-xs font-medium text-white/40">Upgrade to Elite or Legendary for AI Architect access.</p>
              </div>
            </div>
            <Link href="/plans">
              <Button variant="ghost" className="h-10 border-gold/20 text-gold text-[10px] font-black uppercase tracking-widest px-6 shadow-xl shadow-gold/5">
                Scale Up
              </Button>
            </Link>
          </motion.div>
        )}
        {/* Hero Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
                <ProgressRing
                  value={calorieProgress}
                  color="#F5C518"
                  label="Calories"
                  sublabel="1,540 / 2,000"
                  icon={<Flame className="w-5 h-5 text-gold" />}
                />
                <ProgressRing
                  value={proteinProgress}
                  color="#DC143C"
                  label="Protein"
                  sublabel="165g / 180g"
                  icon={<Zap className="w-5 h-5 text-crimson" />}
                />
                <ProgressRing
                  value={workoutProgress}
                  color="#6366f1"
                  label="Workouts"
                  sublabel={`${recentSessions.length} / 4 this week`}
                  icon={<Dumbbell className="w-5 h-5 text-indigo-400" />}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <MetricCard
            icon={TrendingUp}
            iconColor="#F5C518"
            label="Current Weight"
            value={metrics?.weight_kg?.toFixed(1) ?? '--'}
            unit="kg"
            sublabel="Latest measurement"
          />
          <MetricCard
            icon={Target}
            iconColor="#DC143C"
            label="BMI"
            value={bmi?.toFixed(1) ?? '--'}
            sublabel={bmi ? bmiCategory(bmi) : 'Log metrics'}
          />
          <MetricCard
            icon={Dumbbell}
            iconColor="#6366f1"
            label="Total Sessions"
            value={recentSessions.length}
            unit="this week"
            sublabel="Keep it up!"
          />
          <MetricCard
            icon={Trophy}
            iconColor="#22c55e"
            label="Active Plan"
            value={activePlan ? '1' : '0'}
            sublabel={activePlan?.title ?? 'No plan assigned'}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Weekly Heatmap */}
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
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                {weekDays.map((day, i) => {
                  const isToday = i === todayIndex;
                  const hasWorkout = recentSessions.some((s: any) => {
                    const d = new Date((s.completed_at || s.started_at) * 1000).getDay();
                    return d === i;
                  });
                  return (
                    <div key={day} className="flex flex-col items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-gold' : 'text-[--text-muted]/60'}`}>{day}</span>
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 cursor-default ${
                          hasWorkout
                            ? 'bg-gold/20 border border-gold/40 shadow-[0_0_15px_rgba(245,197,24,0.15)]'
                            : isToday
                            ? 'glass border border-gold/30 shadow-[0_0_10px_rgba(245,197,24,0.1)]'
                            : 'bg-white/3 border border-white/5'
                        }`}
                      >
                        {hasWorkout && <Dumbbell className="w-5 h-5 text-gold drop-shadow-[0_0_5px_rgba(245,197,24,0.3)]" />}
                        {!hasWorkout && isToday && <div className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_8px_rgba(245,197,24,0.6)]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Recent sessions list */}
              {recentSessions.length > 0 && (
                <div className="mt-10 pt-8 border-t border-white/5">
                  <p className="text-[10px] font-black text-[--text-muted]/40 uppercase tracking-[0.2em] mb-6">Recent History</p>
                  <div className="space-y-4">
                    {recentSessions.slice(0, 3).map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                        <div className="flex items-center gap-4">
                          <div className="w-1.5 h-6 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                          <div>
                            <span className="text-sm font-black text-[--text-primary] block tracking-tight">{s.plan_title || 'Free Session'}</span>
                            <span className="text-[10px] text-[--text-muted]/60 font-bold uppercase tracking-wide">Elite Athlete Program</span>
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

          {/* Next Workout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="h-full flex flex-col border-white/5">
              <h3 className="font-display font-black text-xl text-[--text-primary] tracking-tight uppercase mb-8">Next Target</h3>
              {nextDay ? (
                <>
                  <div className="flex-1 space-y-8">
                    <div>
                      <Badge variant="gold" className="mb-4 px-4 py-1 text-xs shadow-lg shadow-gold/5 font-black uppercase tracking-widest">{nextDay.focus}</Badge>
                      <h4 className="font-display font-black text-3xl md:text-4xl text-[--text-primary] tracking-tighter leading-none mb-2">{nextDay.dayName}</h4>
                      <div className="w-10 h-1 bg-gold rounded-full opacity-30" />
                    </div>
                    <div className="space-y-4">
                      {nextDay.exercises.slice(0, 4).map((ex: any, i: number) => (
                        <div key={i} className="flex items-center justify-between group">
                          <span className="text-sm font-medium text-[--text-muted] group-hover:text-[--text-primary] transition-colors">{ex.exerciseName}</span>
                          <span className="text-sm font-black text-gold tracking-tight">{ex.sets}×{ex.reps}</span>
                        </div>
                      ))}
                      {nextDay.exercises.length > 4 && (
                        <p className="text-[10px] font-black text-[--text-muted]/40 uppercase tracking-widest mt-4">
                          +{nextDay.exercises.length - 4} more exercises
                        </p>
                      )}
                    </div>
                  </div>
                  <Link href="/trainee/arena" className="mt-10">
                    <Button variant="primary" className="w-full h-14 gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/10">
                      Start Session
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-6">
                    <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center border border-white/5 relative overflow-hidden group">
                      <Brain className="w-10 h-10 text-[--text-muted]/40 group-hover:text-gold/40 transition-colors" />
                      {isFree && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                           <ShieldCheck className="w-6 h-6 text-gold/60" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                       <p className="text-lg font-black text-[--text-primary] tracking-tight">AI Architect</p>
                       <p className="text-sm text-[--text-muted]/60 max-w-[200px] mx-auto font-medium">
                         {isFree 
                           ? 'Upgrade to Elite to unlock autonomous plan generation.' 
                           : 'Generate your personalized evolution path with AI Architect.'}
                       </p>
                    </div>
                  </div>
                  <Link href={isFree ? "/plans" : "/trainee/architect"}>
                    <Button variant={isFree ? "ghost" : "primary"} className="w-full h-14 gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/10">
                      {isFree ? <Trophy className="w-4 h-4 text-gold" /> : <Zap className="w-4 h-4 fill-current" />}
                      {isFree ? 'Scale Evolution' : 'AI Architect'}
                    </Button>
                  </Link>
                </>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Body metrics preview */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassCard className="border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display font-black text-xl text-[--text-primary] tracking-tight uppercase">Biometric Vault</h3>
                <Link href="/trainee/vault" className="text-[10px] font-black text-gold hover:text-gold-light transition-all uppercase tracking-widest flex items-center gap-2 group">
                  Full Analytics 
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: 'WEIGHT', value: metrics.weight_kg ? `${metrics.weight_kg}kg` : '--' },
                  { label: 'BODY FAT', value: metrics.body_fat_pct ? `${metrics.body_fat_pct}%` : '--' },
                  { label: 'WAIST', value: metrics.waist_cm ? `${metrics.waist_cm}cm` : '--' },
                  { label: 'BICEP', value: metrics.bicep_cm ? `${metrics.bicep_cm}cm` : '--' },
                ].map(m => (
                  <div key={m.label} className="bg-white/3 group hover:bg-white/5 border border-white/5 rounded-2xl p-5 text-center transition-all duration-500">
                    <div className="font-display font-black text-2xl md:text-3xl text-[--text-primary] group-hover:scale-110 transition-transform duration-500 tracking-tighter">{m.value}</div>
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
