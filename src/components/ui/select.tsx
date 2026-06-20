import { ChevronDown } from 'lucide-react';
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-9 w-full appearance-none rounded-lg border bg-white pl-3 pr-9 text-sm text-neutral-900 shadow-xs transition-colors',
          'focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-50',
          invalid
            ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/30'
            : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/30',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />
    </div>
  ),
);
Select.displayName = 'Select';
