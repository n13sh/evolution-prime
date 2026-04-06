'use client';
import { cn } from '@/lib/utils/cn';
import { useSFX } from '@/lib/hooks/useSFX';
import { useUIStore } from '@/store/ui-store';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'gold' | 'crimson' | null;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, glow, hover = false, onClick }: GlassCardProps) {
  const { playSFX } = useSFX();
  const { soundEnabled } = useUIStore();

  const handleHover = () => {
    if (soundEnabled && hover) playSFX('hover');
  };

  const handleClick = () => {
    if (soundEnabled && (onClick || hover)) playSFX('click');
    onClick?.();
  };

  return (
    <div
      onMouseEnter={handleHover}
      onClick={handleClick}
      className={cn(
        'glass rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300',
        hover && 'glass-hover cursor-pointer active:scale-[0.98]',
        glow === 'gold' && 'gold-glow',
        glow === 'crimson' && 'crimson-glow',
        onClick && 'cursor-pointer active:scale-[0.98]',
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
