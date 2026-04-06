'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Target, Calendar, Utensils, Zap, ArrowRight, ArrowLeft, Loader2, Brain, Sparkles, Scale, Ruler, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { useSFX } from '@/lib/hooks/useSFX';
import { useUIStore } from '@/store/ui-store';

const STEPS = [
  { id: 'metrics', label: 'Biometrics', icon: Scale },
  { id: 'goal', label: 'Ambition', icon: Target },
  { id: 'lifestyle', label: 'Lifestyle', icon: Calendar },
  { id: 'nutrition', label: 'Nutrition', icon: Utensils },
];

export default function ArchitectPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    weight: '75',
    height: '180',
    age: '25',
    gender: 'male',
    goal: 'muscle_gain',
    fitnessLevel: 'beginner',
    daysPerWeek: '4',
    dietaryInfo: '',
  });

  const { playSFX } = useSFX();
  const { pushToast } = useUIStore();
  const router = useRouter();

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      playSFX('transition');
    } else {
      generatePlan();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      playSFX('hover');
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    playSFX('success');

    try {
      const res = await fetch('/api/trainee/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Generation failed');

      pushToast({ type: 'success', title: 'AI Architecture Synchronized!', message: 'Your custom trajectory is ready.' });
      setTimeout(() => router.push('/trainee'), 2500);
    } catch {
      pushToast({ type: 'error', title: 'Calculations Interrupted', message: 'Please try again.' });
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Current Weight (kg)" 
                type="number" 
                value={form.weight} 
                onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
                icon={<Scale className="w-4 h-4" />}
              />
              <Input 
                label="Exact Height (cm)" 
                type="number" 
                value={form.height} 
                onChange={e => setForm(p => ({ ...p, height: e.target.value }))}
                icon={<Ruler className="w-4 h-4" />}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Biological Age" 
                type="number" 
                value={form.age} 
                onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                icon={<UserCircle className="w-4 h-4" />}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-[--text-muted] tracking-widest pl-1">Gender</label>
                <select 
                  value={form.gender} 
                  onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                  className="input-field glass border-white/5 h-12 outline-none p-2"
                >
                  <option value="male">MALE</option>
                  <option value="female">FEMALE</option>
                  <option value="other">NON-BINARY</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 gap-4">
            {['muscle_gain', 'weight_loss', 'endurance', 'general_fitness'].map(g => (
              <button
                key={g}
                onClick={() => setForm(p => ({ ...p, goal: g }))}
                className={`p-5 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                  form.goal === g ? 'bg-gold/10 border-gold/40 text-gold' : 'glass border-white/5 text-[--text-muted]'
                }`}
              >
                <span className="font-bold uppercase tracking-widest">{g.replace('_', ' ')}</span>
                {form.goal === g && <Zap className="w-5 h-5 fill-current" />}
              </button>
            ))}
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
             <div className="space-y-4">
               <label className="text-xs font-black uppercase text-gold tracking-widest block">Experience Level</label>
               <div className="flex gap-3">
                 {['beginner', 'intermediate', 'advanced'].map(l => (
                    <button
                      key={l}
                      onClick={() => setForm(p => ({ ...p, fitnessLevel: l }))}
                      className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        form.fitnessLevel === l ? 'bg-gold text-black border-gold' : 'glass border-white/5 opacity-40'
                      }`}
                    >
                      {l}
                    </button>
                 ))}
               </div>
             </div>
             <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gold tracking-widest block">Signal Availability (Days/Week)</label>
                <input 
                  type="range" min="2" max="7" step="1" 
                  value={form.daysPerWeek} 
                  onChange={e => setForm(p => ({ ...p, daysPerWeek: e.target.value }))}
                  className="w-full accent-gold bg-white/5 rounded-full h-2 appearance-none"
                />
                <div className="flex justify-between text-xs font-black text-[--text-muted]">
                   <span>{form.daysPerWeek} ACTIVE SESSIONS</span>
                   <span className="text-gold tracking-tighter">{7 - parseInt(form.daysPerWeek)} REST DAYS</span>
                </div>
             </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
               <label className="text-xs font-black uppercase text-gold tracking-widest block">Dietary Restrictions / Bio-Notes</label>
               <textarea
                value={form.dietaryInfo}
                onChange={e => setForm(p => ({ ...p, dietaryInfo: e.target.value }))}
                placeholder="e.g. Vegan, Keto, No Gluten, Dairy Intolerant..."
                className="input-field glass border-white/5 w-full min-h-[160px] p-6 text-sm resize-none focus:border-gold/40"
               />
            </div>
            <div className="flex items-center gap-3 p-4 bg-crimson/5 border border-crimson/10 rounded-xl text-crimson/60">
               <Brain className="w-4 h-4 shrink-0" />
               <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">Precision macro-calculated trajectories will be synchronized to your vault.</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#05050a]">
      {/* Background Visuals */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[radial-gradient(circle_at_100%_0%,rgba(245,197,24,0.08),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_0%_100%,rgba(220,20,60,0.05),transparent_70%)]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          {!loading ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
            >
              <GlassCard className="p-8 md:p-12 border-white/5 shadow-2xl relative">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 flex gap-1 px-1 pt-1">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 h-full rounded-full transition-all duration-700 ${i <= step ? 'bg-gold' : 'bg-white/5'}`} 
                    />
                  ))}
                </div>

                <div className="mb-12 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20">
                      {STEPS[step] && (() => {
                        const Icon = STEPS[step].icon;
                        return <Icon className="w-6 h-6 text-gold" />;
                      })()}
                    </div>
                    <div>
                      <h1 className="font-display font-black text-2xl tracking-tighter uppercase">{STEPS[step]?.label}</h1>
                      <p className="text-[10px] font-black text-gold/40 uppercase tracking-[0.3em]">Module 0{step + 1} / Architect</p>
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 text-gold/20 animate-pulse" />
                </div>

                <div className="min-h-[320px]">
                  {renderStep()}
                </div>

                <div className="mt-12 flex gap-4">
                  {step > 0 && (
                    <Button 
                      onClick={handleBack} 
                      variant="ghost" 
                      className="px-8 border-white/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      REVERT
                    </Button>
                  )}
                  <Button 
                    onClick={handleNext} 
                    className="flex-1 h-14 group shadow-xl shadow-gold/10"
                  >
                    {step === STEPS.length - 1 ? 'INITIATE ARCHITECTURE' : 'ADVANCE SIGNAL'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-12"
            >
              <div className="relative w-48 h-48 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-t-2 border-gold opacity-40 shadow-[0_0_30px_rgba(245,197,24,0.3)]"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border-b-2 border-crimson opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-16 h-16 text-gold animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="font-display font-black text-4xl tracking-tighter uppercase">AI <span className="text-gold">Sheduling</span> Paths</h2>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[--text-muted]">Calculating Bio-Efficiency...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
