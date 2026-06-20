import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs transition-colors',
        'placeholder:text-neutral-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-50',
        invalid
          ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/30'
          : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/30',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
