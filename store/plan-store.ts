'use client';
import { create } from 'zustand';

export type PlanStep = 1 | 2 | 3 | 4 | 'preview';

interface PlanFormData {
  goal: string;
  fitnessLevel: string;
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: string;
  equipment: string[];
  daysPerWeek: number;
  sessionDurationMin: number;
  limitations: string;
}

interface PlanState {
  step: PlanStep;
  formData: PlanFormData;
  generatedPlan: Record<string, unknown> | null;
  isGenerating: boolean;
  error: string | null;

  setStep: (step: PlanStep) => void;
  updateFormData: (data: Partial<PlanFormData>) => void;
  setGeneratedPlan: (plan: Record<string, unknown>) => void;
  setGenerating: (val: boolean) => void;
  setError: (err: string | null) => void;
  resetWizard: () => void;
}

const defaultFormData: PlanFormData = {
  goal: '',
  fitnessLevel: '',
  height_cm: 170,
  weight_kg: 70,
  age: 25,
  gender: 'male',
  equipment: [],
  daysPerWeek: 4,
  sessionDurationMin: 60,
  limitations: '',
};

export const usePlanStore = create<PlanState>((set) => ({
  step: 1,
  formData: { ...defaultFormData },
  generatedPlan: null,
  isGenerating: false,
  error: null,

  setStep: (step) => set({ step }),
  updateFormData: (data) => set(state => ({ formData: { ...state.formData, ...data } })),
  setGeneratedPlan: (plan) => set({ generatedPlan: plan, step: 'preview', isGenerating: false }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  resetWizard: () => set({ step: 1, formData: { ...defaultFormData }, generatedPlan: null, error: null }),
}));
