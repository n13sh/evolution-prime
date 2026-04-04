import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[--text-muted]" />
      </div>
      <h3 className="text-lg font-semibold text-[--text-primary] mb-2">{title}</h3>
      {description && <p className="text-sm text-[--text-muted] max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  );
}
