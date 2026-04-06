'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, Zap, Trophy, ArrowRight, Sparkles, Flame, MessageSquare, Brain } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSFX } from '@/lib/hooks/useSFX';

const PLANS = [
  {
    id: 'free',
    name: 'Essential',
    slug: 'free',
    price: { monthly: 0, yearly: 0 },
    description: 'Start your evolution with baseline tracking.',
    features: [
      'Basic Workout Logging',
      'Latest Metric Sync',
      'Community Terminal access',
      'Public Leaderboard'
    ],
    accent: 'slate'
  },
  {
    id: 'moderate',
    name: 'Elite',
    slug: 'moderate',
    price: { monthly: 999, yearly: 9999 },
    description: 'Advanced paths for serious athletic pursuit.',
    features: [
      'ALL Essential features',
      'AI Architect (Standard)',
      'Bio-Metric Progress Charts',
      'Standard Coach Chat',
      'Nutritional Macro Mapping'
    ],
    accent: 'silver',
    popular: true
  },
  {
    id: 'pro',
    name: 'Legendary',
    slug: 'pro',
    price: { monthly: 1999, yearly: 19999 },
    description: 'The absolute pinnacle of fitness technology.',
    features: [
      'ALL Elite features',
      'Adaptive AI (Daily Sync)',
      'Priority 24/7 Coach Direct',
      'Deep Biometric Analytics',
      'Exclusive Alpha Events'
    ],
    accent: 'gold'
  }
];

export default function PlansPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const { playSFX } = useSFX();
  const router = useRouter();

  const handleSelect = (slug: string) => {
    playSFX('transition');
    if (slug === 'free') {
      router.push('/trainee');
    } else {
      router.push(`/payment?plan=${slug}&cycle=${billing}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#05050a] flex flex-col items-center py-20 px-6">
      {/* Background Visuals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-crimson/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass border-gold/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Choose Your Trajectory</span>
          </motion.div>
          
          <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter uppercase mb-6 leading-none">
            Scale Your <span className="text-gradient-gold">Evolution</span>
          </h1>
          <p className="text-[--text-muted] max-w-xl mx-auto text-sm font-medium leading-relaxed uppercase tracking-widest">
            Select the module that matches your ambition. High-performance paths for the elite.
          </p>

          {/* Billing Toggle */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${billing === 'monthly' ? 'text-white' : 'text-[--text-muted]'}`}>Monthly Access</span>
            <button 
              onClick={() => { setBilling(billing === 'monthly' ? 'yearly' : 'monthly'); playSFX('click'); }}
              className="w-16 h-8 glass rounded-full p-1 relative border-white/5"
            >
              <motion.div 
                animate={{ x: billing === 'monthly' ? 0 : 32 }}
                className="w-6 h-6 bg-gold rounded-full shadow-[0_0_15px_rgba(245,197,24,0.4)]"
              />
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${billing === 'yearly' ? 'text-white' : 'text-[--text-muted]'}`}>Yearly Protocol</span>
              <span className="bg-gold/10 text-gold text-[8px] font-black px-2 py-0.5 rounded-full border border-gold/20">2 MONTHS FREE</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-gold text-black text-[9px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-widest">Most Optimized</span>
                </div>
              )}

              <GlassCard 
                className={`p-8 h-full flex flex-col border-white/5 group-hover:border-white/10 transition-all duration-500 ${
                  plan.accent === 'gold' ? 'shadow-[0_0_50px_rgba(245,197,24,0.05)]' : ''
                }`}
                glow={plan.id === 'pro' ? 'gold' : undefined}
              >
                <div className="mb-8">
                  <h3 className="font-display font-black text-2xl uppercase tracking-tighter mb-2">{plan.name}</h3>
                  <p className="text-[10px] font-medium text-[--text-muted] leading-relaxed uppercase tracking-widest">{plan.description}</p>
                </div>

                <div className="mb-10 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter">₹{plan.price[billing].toLocaleString()}</span>
                  <span className="text-[10px] font-black text-[--text-muted] uppercase tracking-widest">/ {billing === 'monthly' ? 'month' : 'year'}</span>
                </div>

                <div className="flex-1 space-y-5 mb-12">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.id === 'free' ? 'bg-white/5' : 'bg-gold/10'}`}>
                        <Check className={`w-2.5 h-2.5 ${plan.id === 'free' ? 'text-white/20' : 'text-gold'}`} strokeWidth={4} />
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${plan.id === 'free' ? 'text-[--text-muted]/60' : 'text-[--text-primary]'}`}>{f}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleSelect(plan.slug)}
                  variant={plan.popular ? 'primary' : 'ghost'}
                  className={`w-full h-14 uppercase tracking-[0.2em] font-black text-xs group ${
                    !plan.popular ? 'border-white/10 hover:border-white/30' : 'shadow-xl shadow-gold/10'
                  }`}
                >
                  Initiate {plan.id === 'free' ? 'Path' : 'Module'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-white/5 opacity-40">
           <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-gold" />
              <div>
                 <p className="text-[10px] font-black tracking-widest uppercase">Secured Verification</p>
                 <p className="text-[9px] font-medium tracking-tighter text-[--text-muted]">Admin-guided manual synchronization.</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <Zap className="w-6 h-6 text-gold" />
              <div>
                 <p className="text-[10px] font-black tracking-widest uppercase">Instant Integration</p>
                 <p className="text-[9px] font-medium tracking-tighter text-[--text-muted]">Modules active immediately post-scan.</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-gold" />
              <div>
                 <p className="text-[10px] font-black tracking-widest uppercase">Zero Hidden Signal</p>
                 <p className="text-[9px] font-medium tracking-tighter text-[--text-muted]">Absolute transparency in your evolution.</p>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
