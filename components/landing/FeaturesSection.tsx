'use client';
import { motion } from 'framer-motion';
import { Brain, Dumbbell, BarChart3, Users, Zap, Target } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const features = [
  {
    icon: Brain,
    title: 'AI Training Architect',
    description: 'Generate hyper-personalized workout plans based on your goals, equipment, and physical profile. Powered by advanced AI.',
    color: '#F5C518',
    badge: 'AI Powered',
  },
  {
    icon: Dumbbell,
    title: 'Live Workout Arena',
    description: 'Real-time session tracking with set/rep logging, rest timers, and automatic PR detection. Your gym companion.',
    color: '#DC143C',
    badge: 'Real-time',
  },
  {
    icon: BarChart3,
    title: 'Progress Vault',
    description: 'Deep analytics on volume trends, body composition, and personal records. Visualize your evolution.',
    color: '#6366f1',
    badge: 'Analytics',
  },
  {
    icon: Users,
    title: 'Elite Coaching',
    description: 'Connect with certified coaches who assign plans, track your progress, and provide direct feedback.',
    color: '#22c55e',
    badge: 'Coaching',
  },
  {
    icon: Target,
    title: 'Body Metrics Tracking',
    description: 'Log weight, body fat %, measurements, and BMI. Watch your transformation unfold over time.',
    color: '#f97316',
    badge: 'Tracking',
  },
  {
    icon: Zap,
    title: 'Glanceable Dashboard',
    description: 'Every metric you need at a glance. Circular progress rings, weekly heatmaps, and smart alerts.',
    color: '#a855f7',
    badge: 'UX Design',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(245,197,24,0.03),transparent)]" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">Platform Features</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[--text-primary] mb-4">
            Everything You Need to<br />
            <span className="text-gradient-gold">Dominate</span>
          </h2>
          <p className="text-[--text-muted] text-lg max-w-2xl mx-auto">
            A complete fitness ecosystem designed around performance, data, and results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard hover className="p-6 h-full">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}30` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[--text-primary]">{feature.title}</h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${feature.color}18`, color: feature.color, border: `1px solid ${feature.color}25` }}
                      >
                        {feature.badge}
                      </span>
                    </div>
                    <p className="text-sm text-[--text-muted] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
