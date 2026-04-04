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
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">Pricing</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[--text-primary] mb-4">
            Invest in Your <span className="text-gradient-crimson">Evolution</span>
          </h2>
          <p className="text-[--text-muted] text-lg max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Every plan comes with a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard
                glow={plan.highlight ? 'gold' : null}
                className={`p-6 h-full flex flex-col ${plan.highlight ? 'border-gold/30' : ''}`}
              >
                {plan.badge && (
                  <div className="inline-flex items-center gap-1.5 badge-gold mb-4 self-start">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-display font-bold text-xl text-[--text-primary] mb-1">{plan.name}</h3>
                <p className="text-sm text-[--text-muted] mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display font-black text-4xl text-[--text-primary]">{plan.price}</span>
                  {plan.period && <span className="text-[--text-muted]">{plan.period}</span>}
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[--text-muted]">
                      <Check className="w-4 h-4 text-gold flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button variant={plan.highlight ? 'primary' : 'ghost'} className="w-full">
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
