'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, BookOpen, MessageSquare, Zap, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';

const nav = [
  { href: '/coach', label: 'Overview', icon: Home, exact: true },
  { href: '/coach/roster', label: 'My Athletes', icon: Users },
  { href: '/coach/plans', label: 'Plan Library', icon: BookOpen },
  { href: '/coach/feedback', label: 'Feedback', icon: MessageSquare },
];

export function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const pushToast = useUIStore(s => s.pushToast);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearUser();
    pushToast({ type: 'info', title: 'Logged out' });
    router.push('/');
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="hidden lg:flex w-64 flex-col glass border-r border-[--glass-border] h-screen sticky top-0">
      <div className="p-6 border-b border-[--glass-border]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-crimson rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-base">
            Evolution<span className="text-gradient-crimson">Prime</span>
          </span>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="badge-gold text-xs">Coach Workspace</span>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {nav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              isActive(item.href, item.exact)
                ? 'bg-crimson/12 text-crimson-light border border-crimson/20'
                : 'text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5'
            )}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[--glass-border]">
        <div className="flex items-center gap-3 px-3 py-2.5 glass rounded-xl mb-2">
          <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-crimson-light" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[--text-primary] truncate">{user?.displayName}</p>
            <p className="text-xs text-[--text-muted] capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-[--text-muted] hover:text-crimson-light hover:bg-crimson/8 transition-all duration-200">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
