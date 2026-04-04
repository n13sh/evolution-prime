import { cn } from '@/lib/utils/cn';

export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('border-2 border-white/10 border-t-gold rounded-full animate-spin', sizes[size])} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[--text-muted] text-sm font-medium">Loading Evolution Prime...</p>
      </div>
    </div>
  );
}
