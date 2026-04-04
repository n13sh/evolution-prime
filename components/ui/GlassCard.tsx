'use client';
import { cn } from '@/lib/utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'gold' | 'crimson' | null;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, glow, hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-2xl',
        hover && 'glass-hover cursor-pointer',
        glow === 'gold' && 'gold-glow',
        glow === 'crimson' && 'crimson-glow',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {children}
    </div>
  );
}
