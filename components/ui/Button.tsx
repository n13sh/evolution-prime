'use client';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'crimson' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  const variants = {
    primary: 'bg-gold text-black font-semibold hover:bg-gold-light hover:shadow-[0_0_20px_rgba(245,197,24,0.4)] active:scale-95',
    crimson: 'bg-crimson text-white font-semibold hover:bg-crimson-light hover:shadow-[0_0_20px_rgba(220,20,60,0.4)] active:scale-95',
    ghost: 'glass glass-hover text-[--text-primary] font-medium active:scale-95',
    outline: 'border border-[rgba(245,197,24,0.3)] text-gold font-medium hover:bg-[rgba(245,197,24,0.08)] active:scale-95 rounded-xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200 font-medium select-none',
        sizes[size],
        variants[variant],
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
