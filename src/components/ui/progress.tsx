import { cn } from '../../lib/cn';

interface ProgressProps {
  value: number; // 0–100
  className?: string;
  indicatorClassName?: string;
  'aria-label'?: string;
}

export function Progress({ value, className, indicatorClassName, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-neutral-200', className)}
      {...props}
    >
      <div
        className={cn('h-full rounded-full bg-primary-500 transition-all duration-500', indicatorClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
