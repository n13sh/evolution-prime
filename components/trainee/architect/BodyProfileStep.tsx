'use client';
import { usePlanStore } from '@/store/plan-store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function BodyProfileStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { formData, updateFormData } = usePlanStore();

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-[--text-primary] mb-2">Your Body Profile</h2>
        <p className="text-[--text-muted]">Help us personalize your plan with your physical stats</p>
      </div>

      <div className="flex flex-col gap-5 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            placeholder="25"
            value={formData.age || ''}
            onChange={e => updateFormData({ age: parseInt(e.target.value) })}
            min={13} max={99}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[--text-muted]">Gender</label>
            <div className="flex gap-2">
              {['male', 'female', 'other'].map(g => (
                <button
                  key={g}
                  onClick={() => updateFormData({ gender: g })}
                  className={`flex-1 glass py-3 rounded-xl text-xs font-semibold capitalize transition-all ${
                    formData.gender === g ? 'border-gold/40 text-gold bg-gold/8' : 'text-[--text-muted]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Height (cm)"
            type="number"
            placeholder="175"
            value={formData.height_cm || ''}
            onChange={e => updateFormData({ height_cm: parseFloat(e.target.value) })}
            min={100} max={250}
          />
          <Input
            label="Weight (kg)"
            type="number"
            placeholder="75"
            value={formData.weight_kg || ''}
            onChange={e => updateFormData({ weight_kg: parseFloat(e.target.value) })}
            min={30} max={300}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[--text-muted]">Injuries / Limitations (optional)</label>
          <textarea
            className="input-field resize-none h-24"
            placeholder="e.g., bad left knee, avoid overhead pressing..."
            value={formData.limitations}
            onChange={e => updateFormData({ limitations: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!formData.age || !formData.height_cm || !formData.weight_kg}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
