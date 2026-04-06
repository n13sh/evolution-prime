'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: 47, suffix: '%', label: 'Average strength increase in 3 months' },
  { icon: Award, value: 98, suffix: '%', label: 'User satisfaction rate' },
  { icon: Clock, value: 12, suffix: 'min', label: 'Average session setup time saved' },
  { icon: Target, value: 3.2, suffix: 'x', label: 'Faster goal achievement vs traditional' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(spring, (current) => 
    value % 1 === 0 ? Math.floor(current).toString() : current.toFixed(1)
  );

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, value, spring]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export function StatsSection() {
  return (
    <section className="py-24 border-y border-white/5 relative overflow-hidden bg-black/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(245,197,24,0.06),transparent)]" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.15, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="text-center group"
            >
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/40">
                <stat.icon className="w-7 h-7 text-gold drop-shadow-[0_0_8px_rgba(245,197,24,0.4)]" />
              </div>
              <div className="font-display font-black text-4xl md:text-5xl text-gradient-gold mb-3 tracking-tighter">
                <Counter value={stat.value} suffix={stat.suffix} />
                <span className="text-2xl md:text-3xl ml-0.5">{stat.suffix}</span>
              </div>
              <p className="text-[10px] md:text-xs text-[--text-muted] font-bold uppercase tracking-[0.15em] max-w-[160px] mx-auto leading-relaxed opacity-60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
