import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      'h-9 w-full rounded-lg border bg-white px-3 text-sm text-neutral-900 shadow-xs transition-colors',
      'placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400',
      invalid
        ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/30'
        : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/30',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';
