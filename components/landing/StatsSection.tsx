'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: '47%', label: 'Average strength increase in 3 months' },
  { icon: Award, value: '98%', label: 'User satisfaction rate' },
  { icon: Clock, value: '12min', label: 'Average session setup time saved' },
  { icon: Target, value: '3.2x', label: 'Faster goal achievement vs traditional' },
];

export function StatsSection() {
  return (
    <section className="py-16 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(245,197,24,0.04),transparent)]" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
              <div className="font-display font-black text-3xl md:text-4xl text-gradient-gold mb-1">{stat.value}</div>
              <p className="text-xs text-[--text-muted] leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
