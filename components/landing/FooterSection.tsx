import Link from 'next/link';
import { Zap } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="relative py-20 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,197,24,0.03),transparent)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg] shadow-lg shadow-gold/10">
                <Zap className="w-5 h-5 text-black" fill="black" />
              </div>
              <span className="font-display font-black text-2xl tracking-tighter uppercase">
                Evolution<span className="text-gold italic">Prime</span>
              </span>
            </Link>
            <p className="text-[10px] font-black text-[--text-muted]/40 uppercase tracking-[0.3em]">Crafting Leaders Since MMXXIV</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center gap-10">
              {['Privacy', 'Terms', 'Contact'].map(item => (
                <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-[--text-muted]/60 hover:text-gold transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-gold hover:after:w-full after:transition-all">
                  {item}
                </a>
              ))}
            </div>
            <p className="text-[10px] font-bold text-[--text-muted]/30 uppercase tracking-widest">
              © {new Date().getFullYear()} EVOLUTION PRIME. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
