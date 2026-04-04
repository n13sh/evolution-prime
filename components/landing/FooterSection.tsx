import Link from 'next/link';
import { Zap } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" fill="black" />
            </div>
            <span className="font-display font-bold text-lg">
              Evolution<span className="text-gradient-gold">Prime</span>
            </span>
          </Link>
          <p className="text-sm text-[--text-muted]">
            © {new Date().getFullYear()} Evolution Prime. Crafting Leaders.
          </p>
          <div className="flex items-center gap-6 text-sm text-[--text-muted]">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" className="hover:text-[--text-primary] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
