'use client';
import { motion } from 'framer-motion';
import { Dumbbell, Flame, Target, TrendingUp, Calendar, Zap, ArrowRight, Trophy, Brain } from 'lucide-react';
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
}

export function TraineeDashboardClient({ user, metrics, recentSessions, activePlan, traineeProfile }: Props) {
  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = today.getDay();

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

      <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* Hero Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard glow="gold" className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(245,197,24,0.06),transparent)]" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-[--text-primary]">Today&apos;s Progress</h2>
                  <p className="text-sm text-[--text-muted]">Keep pushing — you&apos;re doing great</p>
                </div>
                <Badge variant="gold">
                  <Flame className="w-3 h-3 mr-1 inline" />
                  {recentSessions.length} day streak
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-6 justify-items-center">
                <ProgressRing
                  value={calorieProgress}
                  color="#F5C518"
                  label="Calories"
                  sublabel="1,540 / 2,000"
                  icon={<Flame className="w-4 h-4 text-gold" />}
                />
                <ProgressRing
                  value={proteinProgress}
                  color="#DC143C"
                  label="Protein"
                  sublabel="165g / 180g"
                  icon={<Zap className="w-4 h-4 text-crimson" />}
                />
                <ProgressRing
                  value={workoutProgress}
                  color="#6366f1"
                  label="Workouts"
                  sublabel={`${recentSessions.length} / 4 this week`}
                  icon={<Dumbbell className="w-4 h-4 text-indigo-400" />}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-[--text-primary]">This Week</h3>
                <Calendar className="w-4 h-4 text-[--text-muted]" />
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, i) => {
                  const isToday = i === todayIndex;
                  const hasWorkout = recentSessions.some((s: any) => {
                    const d = new Date((s.completed_at || s.started_at) * 1000).getDay();
                    return d === i;
                  });
                  return (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                      <span className={`text-xs font-medium ${isToday ? 'text-gold' : 'text-[--text-muted]'}`}>{day}</span>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          hasWorkout
                            ? 'bg-gold/20 border border-gold/30'
                            : isToday
                            ? 'glass border border-white/15'
                            : 'bg-white/3'
                        }`}
                      >
                        {hasWorkout && <Dumbbell className="w-4 h-4 text-gold" />}
                        {!hasWorkout && isToday && <div className="w-1.5 h-1.5 bg-gold rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Recent sessions list */}
              {recentSessions.length > 0 && (
                <div className="mt-5 pt-5 border-t border-[--glass-border]">
                  <p className="text-xs text-[--text-muted] font-medium mb-3">Recent Sessions</p>
                  <div className="flex flex-col gap-2">
                    {recentSessions.slice(0, 3).map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gold" />
                          <span className="text-sm text-[--text-primary]">{s.plan_title || 'Free Session'}</span>
                        </div>
                        <span className="text-xs text-[--text-muted]">{formatRelative(s.completed_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Next Workout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 h-full flex flex-col">
              <h3 className="font-semibold text-[--text-primary] mb-5">Next Workout</h3>
              {nextDay ? (
                <>
                  <div className="flex-1">
                    <Badge variant="gold" className="mb-3">{nextDay.focus}</Badge>
                    <h4 className="font-bold text-lg text-[--text-primary] mb-4">{nextDay.dayName}</h4>
                    <div className="flex flex-col gap-2">
                      {nextDay.exercises.slice(0, 4).map((ex: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-[--text-muted]">{ex.exerciseName}</span>
                          <span className="text-[--text-primary] font-medium">{ex.sets}×{ex.reps}</span>
                        </div>
                      ))}
                      {nextDay.exercises.length > 4 && (
                        <p className="text-xs text-[--text-muted]">+{nextDay.exercises.length - 4} more exercises</p>
                      )}
                    </div>
                  </div>
                  <Link href="/trainee/arena" className="mt-6">
                    <Button variant="primary" className="w-full gap-2">
                      Start Session
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                    <Brain className="w-10 h-10 text-[--text-muted] mb-3" />
                    <p className="text-sm text-[--text-muted] mb-4">No plan assigned yet. Generate one with AI!</p>
                  </div>
                  <Link href="/trainee/architect">
                    <Button variant="primary" className="w-full gap-2">
                      <Zap className="w-4 h-4" />
                      AI Architect
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[--text-primary]">Body Metrics</h3>
                <Link href="/trainee/vault" className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1">
                  Full Analytics <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Weight', value: metrics.weight_kg ? `${metrics.weight_kg}kg` : '--' },
                  { label: 'Body Fat', value: metrics.body_fat_pct ? `${metrics.body_fat_pct}%` : '--' },
                  { label: 'Waist', value: metrics.waist_cm ? `${metrics.waist_cm}cm` : '--' },
                  { label: 'Bicep', value: metrics.bicep_cm ? `${metrics.bicep_cm}cm` : '--' },
                ].map(m => (
                  <div key={m.label} className="bg-white/3 rounded-xl p-3 text-center">
                    <div className="font-display font-bold text-xl text-[--text-primary]">{m.value}</div>
                    <div className="text-xs text-[--text-muted] mt-0.5">{m.label}</div>
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
