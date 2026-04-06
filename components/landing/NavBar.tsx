'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/ui-store';

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { soundEnabled, toggleSound } = useUIStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5,5,10,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        height: scrolled ? '72px' : '96px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg] shadow-lg shadow-gold/10">
            <Zap className="w-5 h-5 text-black" fill="black" />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter uppercase">
            Evolution<span className="text-gold italic">Prime</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {['Features', 'Pricing', 'Coaches', 'Community'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[--text-muted]/60 hover:text-gold transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-gold hover:after:w-full after:transition-all"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={toggleSound}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/10 text-gold hover:scale-110 transition-all duration-300"
            title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-40" />}
          </button>
          <Link href="/auth">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[--text-muted]/60 hover:text-[--text-primary] transition-colors cursor-pointer">Sign In</span>
          </Link>
          <Link href="/auth?mode=register">
            <Button variant="primary" className="h-11 px-8 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/10 hover:shadow-gold/20 transition-all duration-500">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl glass border border-white/10 text-gold"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-white/10 px-8 py-10 flex flex-col gap-8 shadow-2xl"
        >
          {['Features', 'Pricing', 'Coaches', 'Community'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-black uppercase tracking-[0.3em] text-[--text-muted] hover:text-gold transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
            <Link href="/auth" onClick={() => setMobileOpen(false)}>
               <Button variant="ghost" className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em]">Sign In</Button>
            </Link>
            <Link href="/auth?mode=register" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/10">Get Started Free</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
