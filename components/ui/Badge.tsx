import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'crimson' | 'green' | 'blue' | 'purple' | 'default';
  className?: string;
}

const variants = {
  gold: 'badge-gold',
  crimson: 'badge-red',
  green: 'badge-green',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  default: 'bg-white/10 text-[--text-muted] border border-white/10',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full', variants[variant], className)}>
      {children}
    </span>
  );
}
