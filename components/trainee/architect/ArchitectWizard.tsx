'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanStore } from '@/store/plan-store';
import { useUIStore } from '@/store/ui-store';
import { StepIndicator } from './StepIndicator';
import { GoalStep } from './GoalStep';
import { BodyProfileStep } from './BodyProfileStep';
import { EquipmentStep } from './EquipmentStep';
import { ScheduleStep } from './ScheduleStep';
import { GeneratedPlanPreview } from './GeneratedPlanPreview';

export function ArchitectWizard() {
  const { step, formData, setStep, setGeneratedPlan, setGenerating, setError, isGenerating } = usePlanStore();
  const pushToast = useUIStore(s => s.pushToast);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setGeneratedPlan(data.plan);
      pushToast({ type: 'success', title: 'Plan generated!', message: 'Your AI training plan is ready.' });
    } catch {
      setError('Failed to generate plan. Please try again.');
      pushToast({ type: 'error', title: 'Generation failed' });
      setGenerating(false);
    }
  };

  const steps = [
    { id: 1, label: 'Goal' },
    { id: 2, label: 'Profile' },
    { id: 3, label: 'Equipment' },
    { id: 4, label: 'Schedule' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {step !== 'preview' && (
        <div className="mb-8">
          <StepIndicator steps={steps} current={step as number} />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && <GoalStep onNext={() => setStep(2)} />}
          {step === 2 && <BodyProfileStep onBack={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && <EquipmentStep onBack={() => setStep(2)} onNext={() => setStep(4)} />}
          {step === 4 && <ScheduleStep onBack={() => setStep(3)} onGenerate={handleGenerate} isGenerating={isGenerating} />}
          {step === 'preview' && <GeneratedPlanPreview />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
