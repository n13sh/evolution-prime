'use client';
import { usePlanStore } from '@/store/plan-store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { TrendingDown, Dumbbell, Heart, Activity } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const goals = [
  { value: 'muscle_gain', label: 'Build Muscle', description: 'Pack on lean mass and increase strength', icon: Dumbbell, color: '#F5C518' },
  { value: 'weight_loss', label: 'Lose Fat', description: 'Burn fat while preserving muscle mass', icon: TrendingDown, color: '#DC143C' },
  { value: 'endurance', label: 'Endurance', description: 'Improve cardiovascular fitness and stamina', icon: Activity, color: '#6366f1' },
  { value: 'general_fitness', label: 'General Fitness', description: 'Well-rounded health and athleticism', icon: Heart, color: '#22c55e' },
];

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner', description: '< 1 year training' },
  { value: 'intermediate', label: 'Intermediate', description: '1-3 years training' },
  { value: 'advanced', label: 'Advanced', description: '3+ years training' },
];

export function GoalStep({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = usePlanStore();

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-[--text-primary] mb-2">What&apos;s Your Goal?</h2>
        <p className="text-[--text-muted]">Choose your primary fitness objective</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {goals.map(goal => {
          const selected = formData.goal === goal.value;
          return (
            <GlassCard
              key={goal.value}
              hover
              onClick={() => updateFormData({ goal: goal.value })}
              className={cn('p-4 cursor-pointer transition-all duration-200', selected && 'border-gold/40 bg-gold/5')}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${goal.color}18`, border: `1px solid ${goal.color}30` }}
              >
                <goal.icon className="w-5 h-5" style={{ color: goal.color }} />
              </div>
              <h3 className={cn('font-semibold text-sm mb-1', selected ? 'text-gold' : 'text-[--text-primary]')}>
                {goal.label}
              </h3>
              <p className="text-xs text-[--text-muted] leading-relaxed">{goal.description}</p>
            </GlassCard>
          );
        })}
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-[--text-primary] mb-3">Fitness Level</h3>
        <div className="flex gap-3">
          {fitnessLevels.map(level => {
            const selected = formData.fitnessLevel === level.value;
            return (
              <button
                key={level.value}
                onClick={() => updateFormData({ fitnessLevel: level.value })}
                className={cn(
                  'flex-1 glass py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200',
                  selected ? 'border-gold/40 text-gold bg-gold/8' : 'text-[--text-muted] hover:text-[--text-primary]'
                )}
              >
                <div className="font-semibold">{level.label}</div>
                <div className="text-xs font-normal mt-0.5 opacity-70">{level.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        variant="primary"
        onClick={onNext}
        disabled={!formData.goal || !formData.fitnessLevel}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}
