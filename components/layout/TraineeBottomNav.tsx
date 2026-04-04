'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Brain, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const nav = [
  { href: '/trainee', label: 'Home', icon: Home, exact: true },
  { href: '/trainee/arena', label: 'Arena', icon: Dumbbell },
  { href: '/trainee/architect', label: 'AI', icon: Brain },
  { href: '/trainee/vault', label: 'Vault', icon: BarChart3 },
];

export function TraineeBottomNav() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-[--glass-border]">
      <div className="flex items-center">
        {nav.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200',
                active ? 'text-gold' : 'text-[--text-muted] hover:text-[--text-primary]'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
              {active && <div className="absolute bottom-0 w-8 h-0.5 bg-gold rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
