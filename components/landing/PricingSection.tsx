'use client';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const plans = [
  {
    name: 'Athlete',
    price: 'Free',
    description: 'Start your evolution journey',
    features: ['AI Plan Generator (3/month)', 'Workout Logger', 'Progress Tracking', 'Body Metrics', 'Community Access'],
    cta: 'Get Started Free',
    highlight: false,
    href: '/auth?mode=register',
  },
  {
    name: 'Elite',
    price: '$19',
    period: '/month',
    description: 'For serious athletes',
    features: ['Unlimited AI Plans', 'Advanced Analytics', 'Coach Assignment', 'Video Library', 'Priority Support', 'PR Tracking', 'Diet Plans'],
    cta: 'Join Elite',
    highlight: true,
    badge: 'Most Popular',
    href: '/auth?mode=register&plan=elite',
  },
  {
    name: 'Coach Pro',
    price: '$49',
    period: '/month',
    description: 'Scale your coaching business',
    features: ['Up to 50 Trainees', 'Plan Builder & Library', 'Trainee Analytics', 'Feedback Tools', 'Custom Branding', 'API Access', 'Dedicated Support'],
    cta: 'Start Coaching',
    highlight: false,
    href: '/auth?mode=register&role=coach',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(220,20,60,0.03),transparent)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 glass rounded-full border border-crimson/20 mb-6"
          >
            <span className="text-[10px] font-bold text-crimson-light tracking-widest uppercase">Investment in Self</span>
          </motion.div>
          <h2 className="font-display font-black text-5xl md:text-7xl text-[--text-primary] mb-8 leading-[0.9] tracking-tighter">
            Choose Your <span className="text-gradient-crimson italic">Evolution</span>
          </h2>
          <p className="text-[--text-muted] text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed">
            No hidden fees. Total transparency. Every plan is built to push your limits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.15, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="group h-full"
            >
              <GlassCard
                glow={plan.highlight ? 'gold' : null}
                className={`p-8 h-full flex flex-col relative transition-all duration-500 bg-white/2 border-white/5 ${
                  plan.highlight 
                    ? 'border-gold/40 shadow-[0_40px_80px_-20px_rgba(245,197,24,0.15)] ring-1 ring-gold/20' 
                    : 'hover:border-white/20'
                }`}
                hover
              >
                {plan.badge && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="absolute -top-4 left-8 inline-flex items-center gap-1.5 bg-gold text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-[0_8px_20px_rgba(245,197,24,0.3)] z-10"
                  >
                    <Zap className="w-3 h-3 fill-black" />
                    {plan.badge}
                  </motion.div>
                )}
                
                <div className="mb-10">
                  <h3 className="font-display font-black text-2xl text-[--text-primary] mb-2 tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-[--text-muted]/60 font-bold uppercase tracking-widest">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-10 group-hover:scale-105 transition-transform origin-left duration-500">
                  <span className="font-display font-black text-6xl text-[--text-primary] tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-sm font-bold text-[--text-muted] tracking-wide mb-2 opacity-60">{plan.period}</span>}
                </div>

                <div className="space-y-4 mb-12 flex-1">
                  <p className="text-[10px] font-black text-[--text-muted] uppercase tracking-[0.2em] mb-6 opacity-40">Features Included</p>
                  {plan.features.map((f, idx) => (
                    <motion.li 
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + idx * 0.05 }}
                      className="flex items-center gap-3 text-sm text-[--text-muted] font-medium list-none group-hover:text-[--text-primary] transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-gold" strokeWidth={3} />
                      </div>
                      {f}
                    </motion.li>
                  ))}
                </div>

                <Link href={plan.href} className="mt-auto block">
                  <Button 
                    variant={plan.highlight ? 'primary' : 'ghost'} 
                    className={`w-full h-14 font-black uppercase tracking-widest text-xs transition-all duration-500 ${
                      plan.highlight ? 'shadow-xl shadow-gold/10 hover:shadow-gold/20' : ''
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
