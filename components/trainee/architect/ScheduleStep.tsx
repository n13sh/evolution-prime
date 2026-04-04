'use client';
import { usePlanStore } from '@/store/plan-store';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Brain, Zap } from 'lucide-react';

export function ScheduleStep({
  onBack,
  onGenerate,
  isGenerating,
}: {
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  const { formData, updateFormData } = usePlanStore();

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-[--text-primary] mb-2">Training Schedule</h2>
        <p className="text-[--text-muted]">How often and how long can you train?</p>
      </div>

      <div className="flex flex-col gap-6 mb-8">
        {/* Days per week */}
        <div>
          <label className="text-sm font-medium text-[--text-muted] block mb-3">
            Days per week: <span className="text-gold font-bold text-base">{formData.daysPerWeek}</span>
          </label>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6].map(days => (
              <button
                key={days}
                onClick={() => updateFormData({ daysPerWeek: days })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  formData.daysPerWeek === days
                    ? 'bg-gold text-black'
                    : 'glass text-[--text-muted] hover:text-[--text-primary]'
                }`}
              >
                {days}
              </button>
            ))}
          </div>
        </div>

        {/* Session duration */}
        <div>
          <label className="text-sm font-medium text-[--text-muted] block mb-3">
            Session duration: <span className="text-gold font-bold text-base">{formData.sessionDurationMin} min</span>
          </label>
          <div className="flex gap-2">
            {[30, 45, 60, 75, 90].map(min => (
              <button
                key={min}
                onClick={() => updateFormData({ sessionDurationMin: min })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  formData.sessionDurationMin === min
                    ? 'bg-gold text-black'
                    : 'glass text-[--text-muted] hover:text-[--text-primary]'
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <GlassCard className="p-5">
          <h3 className="font-semibold text-[--text-primary] mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-gold" />
            Plan Summary
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-[--text-muted]">Goal:</span> <span className="text-[--text-primary] font-medium capitalize">{formData.goal?.replace('_', ' ')}</span></div>
            <div><span className="text-[--text-muted]">Level:</span> <span className="text-[--text-primary] font-medium capitalize">{formData.fitnessLevel}</span></div>
            <div><span className="text-[--text-muted]">Equipment:</span> <span className="text-[--text-primary] font-medium">{formData.equipment.length} types</span></div>
            <div><span className="text-[--text-muted]">Schedule:</span> <span className="text-[--text-primary] font-medium">{formData.daysPerWeek}x / {formData.sessionDurationMin}min</span></div>
          </div>
        </GlassCard>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button
          variant="primary"
          onClick={onGenerate}
          loading={isGenerating}
          className="flex-1 gap-2"
        >
          {!isGenerating && <Zap className="w-4 h-4" />}
          Generate Plan
        </Button>
      </div>
    </div>
  );
}
