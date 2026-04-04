'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlanStore } from '@/store/plan-store';
import { useUIStore } from '@/store/ui-store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronDown, ChevronUp, Save, RefreshCw, Dumbbell, Clock, Calendar } from 'lucide-react';

export function GeneratedPlanPreview() {
  const { generatedPlan, resetWizard, setStep } = usePlanStore();
  const pushToast = useUIStore(s => s.pushToast);
  const [saving, setSaving] = useState(false);
  const [expandedDays, setExpandedDays] = useState<number[]>([0]);

  if (!generatedPlan) return null;

  const plan = generatedPlan as any;
  const days = plan.structure?.days || [];

  const toggleDay = (i: number) => {
    setExpandedDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/workout-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: plan.title,
          description: plan.description,
          goal: plan.goal,
          difficulty: plan.difficulty,
          durationWeeks: plan.durationWeeks,
          daysPerWeek: plan.daysPerWeek,
          structure: JSON.stringify(plan.structure),
          isAiGenerated: 1,
        }),
      });
      if (res.ok) {
        pushToast({ type: 'success', title: 'Plan saved!', message: 'Your training plan has been saved.' });
        resetWizard();
      }
    } catch {
      pushToast({ type: 'error', title: 'Failed to save plan' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Badge variant="gold" className="mb-3">AI Generated</Badge>
        <h2 className="font-display font-bold text-2xl text-[--text-primary] mb-1">{plan.title}</h2>
        <p className="text-[--text-muted] text-sm">{plan.description}</p>
      </div>

      {/* Plan stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <GlassCard className="p-4 text-center">
          <Calendar className="w-5 h-5 text-gold mx-auto mb-2" />
          <div className="font-bold text-lg text-[--text-primary]">{plan.durationWeeks}w</div>
          <div className="text-xs text-[--text-muted]">Duration</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Dumbbell className="w-5 h-5 text-crimson mx-auto mb-2" />
          <div className="font-bold text-lg text-[--text-primary]">{plan.daysPerWeek}x</div>
          <div className="text-xs text-[--text-muted]">Per Week</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
          <div className="font-bold text-lg text-[--text-primary]">{plan.calorieTarget}</div>
          <div className="text-xs text-[--text-muted]">Cal Target</div>
        </GlassCard>
      </div>

      {/* Days */}
      <div className="flex flex-col gap-3 mb-6">
        {days.map((day: any, i: number) => {
          const expanded = expandedDays.includes(i);
          return (
            <motion.div key={i} layout>
              <GlassCard className="overflow-hidden">
                <button
                  onClick={() => toggleDay(i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div>
                    <h3 className="font-semibold text-[--text-primary]">{day.dayName}</h3>
                    <p className="text-xs text-[--text-muted] mt-0.5">{day.exercises.length} exercises</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{day.focus}</Badge>
                    {expanded ? <ChevronUp className="w-4 h-4 text-[--text-muted]" /> : <ChevronDown className="w-4 h-4 text-[--text-muted]" />}
                  </div>
                </button>
                {expanded && (
                  <div className="px-5 pb-5 border-t border-[--glass-border]">
                    <div className="flex flex-col divide-y divide-[--glass-border]">
                      {day.exercises.map((ex: any, j: number) => (
                        <div key={j} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[--text-primary]">{ex.exerciseName}</p>
                            {ex.notes && <p className="text-xs text-[--text-muted] mt-0.5">{ex.notes}</p>}
                          </div>
                          <div className="text-right text-sm">
                            <span className="text-gold font-bold">{ex.sets} sets</span>
                            <span className="text-[--text-muted] mx-1">×</span>
                            <span className="text-[--text-primary]">{ex.reps}</span>
                            {ex.restSec > 0 && (
                              <p className="text-xs text-[--text-muted]">{ex.restSec}s rest</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => setStep(4)} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </Button>
        <Button variant="primary" onClick={handleSave} loading={saving} className="flex-1 gap-2">
          <Save className="w-4 h-4" />
          Save Plan
        </Button>
      </div>
    </div>
  );
}
