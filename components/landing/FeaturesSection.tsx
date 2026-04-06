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
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,197,24,0.05),transparent)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 glass rounded-full border border-gold/20 mb-6"
          >
            <span className="text-[10px] font-bold text-gold tracking-widest uppercase">The Paradigm Shift</span>
          </motion.div>
          <h2 className="font-display font-black text-5xl md:text-7xl text-[--text-primary] mb-8 leading-[0.9] tracking-tighter">
            Everything You Need to<br />
            <span className="text-gradient-gold italic">Dominate</span>
          </h2>
          <p className="text-[--text-muted] text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            A complete fitness ecosystem designed for those who measure progress in data and will.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.7, 
                delay: i * 0.1, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <GlassCard 
                className="p-8 h-full relative overflow-hidden border border-white/5 bg-white/2 hover:bg-white/4 transition-colors"
                hover
              >
                <div 
                  className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ background: feature.color }}
                />
                <div className="flex flex-col gap-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}05)`, 
                      border: `1px solid ${feature.color}30` 
                    }}
                  >
                    <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display font-black text-2xl text-[--text-primary] tracking-tight">{feature.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-[--text-muted]/70 leading-relaxed font-medium mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2">
                       <span
                        className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest"
                        style={{ background: `${feature.color}15`, color: feature.color, border: `1px solid ${feature.color}20` }}
                      >
                        {feature.badge}
                      </span>
                    </div>
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
