'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Zap, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const dashboardY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const dashboardScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const dashboardOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={containerRef} className="relative min-h-[140vh] flex flex-col items-center justify-start overflow-hidden pt-32 md:pt-48">
      {/* Background */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,197,24,0.12),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-surface-base via-surface-base/80 to-transparent" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-crimson/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-10 border border-gold/30 shadow-[0_0_20px_rgba(245,197,24,0.1)]"
        >
          <Zap className="w-4 h-4 text-gold fill-gold" />
          <span className="text-[10px] md:text-xs font-bold text-gold tracking-[0.2em] uppercase">The Future of Performance</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="font-display font-black text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter mb-8"
        >
          <span className="text-[--text-primary]">EVOLUTION</span>
          <br />
          <span className="text-gradient-gold">PRIME</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-xl md:text-3xl text-[--text-muted] max-w-3xl mx-auto mb-6 font-light leading-snug"
        >
          Crafting Leaders. <span className="text-[--text-primary] font-medium italic">One Rep at a Time.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          className="text-base md:text-lg text-[--text-muted]/60 max-w-xl mx-auto mb-14"
        >
          The premium AI-driven fitness ecosystem built for elite athletes, expert coaches, and champions who demand more.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
        >
          <Link href="/auth?mode=register" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="gap-3 w-full sm:px-10 h-14 text-base shadow-xl shadow-gold/10">
              Start Your Evolution
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="lg" className="gap-3 w-full sm:w-auto h-14 px-10 text-base">
            <Play className="w-5 h-5 text-gold fill-gold/20" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Hero dashboard preview */}
        <motion.div
          style={{ y: dashboardY, scale: dashboardScale, opacity: dashboardOpacity }}
          className="relative max-w-5xl mx-auto perspective-1000"
        >
          <div
            className="glass rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Fake browser bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/2">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-crimson/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-gold/50" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 mx-6 glass rounded-full px-5 py-1.5 text-[10px] text-[--text-muted]/60 text-center tracking-wide">
                evoprime.app/trainee/dashboard
              </div>
            </div>
            {/* Dashboard preview */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progress rings */}
              <div className="col-span-1 bg-white/3 rounded-3xl p-6 flex flex-col gap-6">
                <p className="text-xs text-[--text-muted] font-bold uppercase tracking-widest">Today&apos;s Focus</p>
                {[
                  { label: 'Calories', pct: 78, color: '#F5C518' },
                  { label: 'Protein', pct: 92, color: '#DC143C' },
                  { label: 'Workout', pct: 60, color: '#6366f1' },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center gap-5">
                    <svg width="48" height="48" className="shrink-0 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                      <motion.circle
                        cx="24" cy="24" r="20" fill="none"
                        stroke={color} strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - pct / 100) }}
                        transition={{ duration: 2, delay: 0.8, ease: 'easeOut' }}
                        strokeLinecap="round"
                        transform="rotate(-90 24 24)"
                      />
                    </svg>
                    <div>
                      <div className="text-sm font-black text-[--text-primary]">{pct}%</div>
                      <div className="text-[10px] font-bold text-[--text-muted] uppercase tracking-tighter">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Chart area */}
              <div className="col-span-1 md:col-span-2 bg-white/3 rounded-3xl p-6">
                <p className="text-xs text-[--text-muted] font-bold uppercase tracking-widest mb-6">Weekly Volume Distribution</p>
                <div className="flex items-end gap-3 h-32 mb-4">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: 1 + i * 0.1, ease: 'easeOut' }}
                      className="flex-1 rounded-t-xl relative group"
                      style={{ background: `linear-gradient(to top, ${i % 2 === 0 ? 'var(--gold)' : 'var(--crimson)'}, transparent)` }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 rounded-t-xl" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between">
                  {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d, i) => (
                    <span key={i} className="text-[9px] font-black text-[--text-muted] flex-1 text-center">{d}</span>
                  ))}
                </div>
              </div>
              {/* Bottom labels */}
              {['Bench Press PR: 120kg', 'Activity: 1.2k cal', 'Status: Peak Performance'].map((text, i) => (
                <div key={i} className="bg-white/3 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold text-[--text-muted] uppercase mb-2">{text.split(':')[0]}</p>
                  <p className="text-sm font-black text-[--text-primary] truncate">{text.split(':')[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
