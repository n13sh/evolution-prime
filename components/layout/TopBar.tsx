'use client';
import { Bell, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const user = useAuthStore(s => s.user);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[--glass-border] sticky top-0 z-30"
      style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)' }}
    >
      <div>
        <h1 className="font-display font-bold text-xl text-[--text-primary]">{title}</h1>
        {subtitle && <p className="text-sm text-[--text-muted]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/8 transition-colors relative">
          <Bell className="w-4 h-4 text-[--text-muted]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson rounded-full" />
        </button>
        <div className="w-9 h-9 bg-gold/20 rounded-xl flex items-center justify-center">
          <User className="w-4 h-4 text-gold" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-[--text-primary] leading-none">{user?.displayName}</p>
          <p className="text-xs text-[--text-muted] capitalize mt-0.5">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}
