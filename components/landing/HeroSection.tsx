'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,197,24,0.08),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-surface-base to-transparent" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-crimson/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-gold/20"
        >
          <Zap className="w-3.5 h-3.5 text-gold" fill="currentColor" />
          <span className="text-xs font-semibold text-gold tracking-widest uppercase">AI-Powered Fitness</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight mb-6"
        >
          <span className="text-[--text-primary]">Evolution</span>
          <br />
          <span className="text-gradient-gold">Prime</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-[--text-muted] max-w-2xl mx-auto mb-4 font-light leading-relaxed"
        >
          Crafting Leaders. One Rep at a Time.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base text-[--text-muted]/70 max-w-xl mx-auto mb-12"
        >
          The premium AI-driven fitness ecosystem built for elite athletes, expert coaches, and champions who demand more.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/auth?mode=register">
            <Button variant="primary" size="lg" className="gap-2 w-full sm:w-auto">
              Start Your Evolution
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="lg" className="gap-2 w-full sm:w-auto">
            <Play className="w-4 h-4 text-gold" fill="currentColor" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16"
        >
          {[
            { icon: Users, value: '50K+', label: 'Athletes' },
            { icon: TrendingUp, value: '2M+', label: 'Workouts Logged' },
            { icon: Zap, value: '98%', label: 'Goal Achievement' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass rounded-2xl p-4 text-center">
              <Icon className="w-5 h-5 text-gold mx-auto mb-2" />
              <div className="font-display font-bold text-2xl text-[--text-primary]">{value}</div>
              <div className="text-xs text-[--text-muted]">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Hero dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          <div
            className="glass rounded-3xl overflow-hidden border border-white/10"
            style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.07)' }}
          >
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-crimson/60" />
                <div className="w-3 h-3 rounded-full bg-gold/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4 glass rounded-md px-3 py-1 text-xs text-[--text-muted] text-center">
                evoprime.app/trainee
              </div>
            </div>
            {/* Dashboard preview */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {/* Progress rings */}
              <div className="col-span-1 bg-white/3 rounded-2xl p-4 flex flex-col gap-4">
                <p className="text-xs text-[--text-muted] font-medium">Today&apos;s Progress</p>
                {[
                  { label: 'Calories', pct: 78, color: '#F5C518' },
                  { label: 'Protein', pct: 92, color: '#DC143C' },
                  { label: 'Workout', pct: 60, color: '#6366f1' },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <svg width="40" height="40" className="shrink-0">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <circle
                        cx="20" cy="20" r="16" fill="none"
                        stroke={color} strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 20 20)"
                      />
                    </svg>
                    <div>
                      <div className="text-xs font-semibold text-[--text-primary]">{pct}%</div>
                      <div className="text-[10px] text-[--text-muted]">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Chart area */}
              <div className="col-span-2 bg-white/3 rounded-2xl p-4">
                <p className="text-xs text-[--text-muted] font-medium mb-4">Weekly Volume</p>
                <div className="flex items-end gap-2 h-24">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%`, background: `rgba(245,197,24,${0.3 + h/200})` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <span key={i} className="text-[10px] text-[--text-muted] flex-1 text-center">{d}</span>
                  ))}
                </div>
              </div>
              {/* Bottom row */}
              {['Bench Press — 100kg PR', 'Session: 47 min', 'Next: Legs Day'].map((text, i) => (
                <div key={i} className="bg-white/3 rounded-xl p-3">
                  <p className="text-xs text-[--text-primary] font-medium">{text}</p>
                  <div className="mt-1 h-1 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${[80, 60, 40][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Gradient fade at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-base to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
