'use client';
import { cn } from '@/lib/utils/cn';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[--text-muted]">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'input-field',
              icon && 'pl-10',
              error && 'border-crimson/40 focus:border-crimson/60',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-crimson-light">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
