'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,15,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" fill="black" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Evolution<span className="text-gradient-gold">Prime</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-[--text-muted]">
          {['Features', 'Pricing', 'Coaches', 'Community'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-[--text-primary] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth?mode=register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden text-[--text-muted] hover:text-[--text-primary]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-[--glass-border] px-6 py-4 flex flex-col gap-4">
          {['Features', 'Pricing', 'Coaches', 'Community'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[--text-muted] hover:text-[--text-primary] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <Link href="/auth" onClick={() => setMobileOpen(false)}>
            <Button variant="primary" className="w-full">Get Started Free</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
