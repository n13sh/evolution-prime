'use client';
import { usePlanStore } from '@/store/plan-store';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

const equipmentOptions = [
  { value: 'barbell', label: 'Barbell', emoji: '🏋️' },
  { value: 'dumbbell', label: 'Dumbbells', emoji: '💪' },
  { value: 'cable', label: 'Cables', emoji: '⚡' },
  { value: 'machine', label: 'Machines', emoji: '🤖' },
  { value: 'bodyweight', label: 'Bodyweight', emoji: '🧘' },
  { value: 'kettlebell', label: 'Kettlebells', emoji: '🔔' },
  { value: 'bands', label: 'Resistance Bands', emoji: '🎀' },
  { value: 'pull_up_bar', label: 'Pull-Up Bar', emoji: '📊' },
];

export function EquipmentStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { formData, updateFormData } = usePlanStore();

  const toggle = (value: string) => {
    const current = formData.equipment;
    if (current.includes(value)) {
      updateFormData({ equipment: current.filter(e => e !== value) });
    } else {
      updateFormData({ equipment: [...current, value] });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-[--text-primary] mb-2">Available Equipment</h2>
        <p className="text-[--text-muted]">Select all the equipment you have access to</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {equipmentOptions.map(eq => {
          const selected = formData.equipment.includes(eq.value);
          return (
            <GlassCard
              key={eq.value}
              hover
              onClick={() => toggle(eq.value)}
              className={cn('p-4 cursor-pointer flex items-center gap-3', selected && 'border-gold/40 bg-gold/5')}
            >
              <span className="text-2xl">{eq.emoji}</span>
              <span className={cn('font-medium text-sm', selected ? 'text-gold' : 'text-[--text-primary]')}>{eq.label}</span>
              {selected && (
                <div className="ml-auto w-5 h-5 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-black" />
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={formData.equipment.length === 0}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
