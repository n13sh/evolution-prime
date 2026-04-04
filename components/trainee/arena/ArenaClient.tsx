'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Plus, Minus, RotateCcw, Trophy, Dumbbell, Timer, Check } from 'lucide-react';
import { useWorkoutStore } from '@/store/workout-store';
import { useUIStore } from '@/store/ui-store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { WorkoutPlan, Session } from '@/types/db';

interface Props {
  plans: WorkoutPlan[];
  activeSession: Session | null;
  traineeId: number;
}

export function ArenaClient({ plans, activeSession: initialSession, traineeId }: Props) {
  const store = useWorkoutStore();
  const pushToast = useUIStore(s => s.pushToast);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [setInputs, setSetInputs] = useState<{ reps: number; weight: number }[]>([{ reps: 8, weight: 0 }]);
  const [loggedSets, setLoggedSets] = useState<any[]>([]);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isActive = store.activeSessionId !== null;

  // Rest timer
  useEffect(() => {
    if (isResting) {
      timerRef.current = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsResting(false);
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isResting]);

  const planDays = selectedPlan ? JSON.parse(selectedPlan.structure).days : [];
  const currentDay = planDays[selectedDayIndex];
  const exercises = currentDay?.exercises || [];
  const exercise = exercises[currentExercise];

  const startSession = async (plan: WorkoutPlan, dayIdx: number) => {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: plan.id, dayIndex: dayIdx }),
    });
    if (res.ok) {
      const data = await res.json();
      store.startSession(data.session.id, plan.id, dayIdx);
      setSelectedPlan(plan);
      setSelectedDayIndex(dayIdx);
      setCurrentExercise(0);
      setLoggedSets([]);
      pushToast({ type: 'success', title: 'Session started!', message: `${currentDay?.dayName || 'Free session'}` });
    }
  };

  const logSet = async (reps: number, weight: number) => {
    if (!store.activeSessionId || !exercise) return;

    // Find exercise ID from exercises list
    const res = await fetch(`/api/exercises?search=${encodeURIComponent(exercise.exerciseName)}`);
    const data = await res.json();
    const ex = data.exercises?.[0];
    if (!ex) return;

    const logRes = await fetch('/api/workout-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: store.activeSessionId,
        exerciseId: ex.id,
        setNumber: loggedSets.filter(s => s.exerciseName === exercise.exerciseName).length + 1,
        reps,
        weightKg: weight,
      }),
    });

    if (logRes.ok) {
      const logData = await logRes.json();
      const newSet = { exerciseName: exercise.exerciseName, reps, weight, isPR: logData.isPR };
      setLoggedSets(prev => [...prev, newSet]);
      store.logSet({ exerciseId: ex.id, exerciseName: exercise.exerciseName, setNumber: newSet.reps, reps, weightKg: weight });

      if (logData.isPR) {
        pushToast({ type: 'success', title: 'New Personal Record!', message: `${exercise.exerciseName}: ${weight}kg × ${reps}` });
      }

      // Start rest timer
      setIsResting(true);
      setRestTime(exercise.restSec || 90);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setSetInputs([{ reps: 8, weight: 0 }]);
      setIsResting(false);
      setRestTime(0);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    if (!store.activeSessionId) return;
    const duration = store.startedAt ? Math.floor((Date.now() - store.startedAt) / 1000) : 0;
    await fetch(`/api/sessions/${store.activeSessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed', durationSec: duration }),
    });
    store.completeSession();
    setWorkoutComplete(true);
    pushToast({ type: 'success', title: 'Workout Complete!', message: `${loggedSets.length} sets logged` });
  };

  const endSession = async () => {
    if (!store.activeSessionId) return;
    await fetch(`/api/sessions/${store.activeSessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'abandoned' }),
    });
    store.resetSession();
    setSelectedPlan(null);
    setLoggedSets([]);
    setWorkoutComplete(false);
  };

  // Workout complete screen
  if (workoutComplete) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-12">
        <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 gold-glow">
          <Trophy className="w-12 h-12 text-gold" />
        </div>
        <h2 className="font-display font-black text-3xl text-[--text-primary] mb-2">Workout Complete!</h2>
        <p className="text-[--text-muted] mb-6">{loggedSets.length} sets logged · {exercises.length} exercises</p>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Sets', value: loggedSets.length },
              { label: 'Exercises', value: exercises.length },
              { label: 'PRs', value: loggedSets.filter(s => s.isPR).length },
            ].map(stat => (
              <GlassCard key={stat.label} className="p-4 text-center">
                <div className="font-display font-bold text-2xl text-gold">{stat.value}</div>
                <div className="text-xs text-[--text-muted]">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
          <Button variant="primary" onClick={() => { store.resetSession(); setWorkoutComplete(false); setSelectedPlan(null); }} className="w-full">
            Back to Arena
          </Button>
        </div>
      </motion.div>
    );
  }

  // Active workout view
  if (isActive && selectedPlan && exercise) {
    const exerciseSets = loggedSets.filter(s => s.exerciseName === exercise.exerciseName);
    const targetSets = exercise.sets;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Rest timer overlay */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
            >
              <div className="text-center">
                <p className="text-[--text-muted] text-sm font-medium mb-4 uppercase tracking-widest">Rest Time</p>
                <div className="font-display font-black text-8xl text-gold mb-6">{restTime}</div>
                <p className="text-[--text-muted] mb-6">seconds remaining</p>
                <Button variant="ghost" onClick={() => { setIsResting(false); setRestTime(0); }}>
                  Skip Rest
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant="gold">{currentDay.dayName}</Badge>
            <h2 className="font-display font-bold text-xl text-[--text-primary] mt-2">
              Exercise {currentExercise + 1} of {exercises.length}
            </h2>
          </div>
          <Button variant="crimson" size="sm" onClick={endSession}>
            <Square className="w-4 h-4" />
            End
          </Button>
        </div>

        {/* Exercise card */}
        <GlassCard glow="gold" className="p-6 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gold/15 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[--text-primary]">{exercise.exerciseName}</h3>
              <p className="text-sm text-[--text-muted]">{exercise.sets} sets × {exercise.reps} reps · {exercise.restSec}s rest</p>
            </div>
          </div>

          {/* Set progress */}
          <div className="flex gap-2 mb-5">
            {Array.from({ length: targetSets }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${i < exerciseSets.length ? 'bg-gold' : 'bg-white/10'}`}
              />
            ))}
          </div>

          {/* Set logger */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-[--text-muted] font-medium block mb-2">Reps</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setSetInputs(prev => [{ ...prev[0], reps: Math.max(1, prev[0].reps - 1) }])} className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-display font-bold text-2xl text-[--text-primary]">{setInputs[0]?.reps}</span>
                <button onClick={() => setSetInputs(prev => [{ ...prev[0], reps: prev[0].reps + 1 }])} className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-[--text-muted] font-medium block mb-2">Weight (kg)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setSetInputs(prev => [{ ...prev[0], weight: Math.max(0, prev[0].weight - 2.5) }])} className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-display font-bold text-2xl text-[--text-primary]">{setInputs[0]?.weight}</span>
                <button onClick={() => setSetInputs(prev => [{ ...prev[0], weight: prev[0].weight + 2.5 }])} className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => logSet(setInputs[0].reps, setInputs[0].weight)}
            disabled={exerciseSets.length >= targetSets}
            className="w-full gap-2"
          >
            <Check className="w-4 h-4" />
            Log Set {exerciseSets.length + 1} / {targetSets}
          </Button>
        </GlassCard>

        {/* Logged sets */}
        {exerciseSets.length > 0 && (
          <GlassCard className="p-4 mb-5">
            <p className="text-xs text-[--text-muted] font-medium mb-3">Logged Sets</p>
            <div className="flex flex-col gap-2">
              {exerciseSets.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-[--text-muted]">Set {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[--text-primary] font-medium">{s.weight}kg × {s.reps}</span>
                    {s.isPR && <Badge variant="gold">PR</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Next exercise */}
        {exerciseSets.length >= targetSets && (
          <Button variant="primary" onClick={nextExercise} className="w-full gap-2">
            {currentExercise < exercises.length - 1 ? (
              <>Next Exercise: {exercises[currentExercise + 1]?.exerciseName}</>
            ) : (
              <><Trophy className="w-4 h-4" />Finish Workout</>
            )}
          </Button>
        )}
      </div>
    );
  }

  // Plan selection view
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-[--text-primary] mb-1">Choose Your Session</h2>
        <p className="text-sm text-[--text-muted]">Select a plan and day to start training</p>
      </div>

      {plans.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Dumbbell className="w-12 h-12 text-[--text-muted] mx-auto mb-4" />
          <h3 className="font-semibold text-[--text-primary] mb-2">No Plans Yet</h3>
          <p className="text-sm text-[--text-muted] mb-6">Generate an AI plan or wait for your coach to assign one</p>
          <Button variant="primary" onClick={() => window.location.href = '/trainee/architect'}>
            Generate AI Plan
          </Button>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-4">
          {plans.map(plan => {
            const structure = JSON.parse(plan.structure);
            const days = structure.days || [];
            return (
              <GlassCard key={plan.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[--text-primary]">{plan.title}</h3>
                    <p className="text-sm text-[--text-muted] mt-0.5">{plan.days_per_week} days/week · {plan.duration_weeks} weeks</p>
                  </div>
                  {plan.is_ai_generated === 1 && <Badge variant="gold">AI</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {days.map((day: any, i: number) => (
                    <Button
                      key={i}
                      variant={selectedPlan?.id === plan.id && selectedDayIndex === i ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => { setSelectedPlan(plan); setSelectedDayIndex(i); }}
                      className="justify-start gap-2"
                    >
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span className="truncate">{day.focus || day.dayName}</span>
                    </Button>
                  ))}
                </div>
              </GlassCard>
            );
          })}

          {selectedPlan && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => startSession(selectedPlan, selectedDayIndex)}
              className="w-full gap-2"
            >
              <Play className="w-5 h-5" />
              Start {planDays[selectedDayIndex]?.dayName || 'Session'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
