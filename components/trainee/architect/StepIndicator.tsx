import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: { id: number; label: string }[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                current > step.id
                  ? 'bg-gold text-black'
                  : current === step.id
                  ? 'border-2 border-gold text-gold bg-gold/10'
                  : 'border border-white/15 text-[--text-muted]'
              }`}
            >
              {current > step.id ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span className={`text-xs mt-1.5 font-medium ${current === step.id ? 'text-gold' : 'text-[--text-muted]'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-0.5 mx-3 mb-4 rounded-full transition-all duration-300"
              style={{ background: current > step.id ? '#F5C518' : 'rgba(255,255,255,0.1)' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
