import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({ icon: Icon, title, description, action, className, compact }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-2 py-8' : 'gap-3 py-12',
        className,
      )}
    >
      {Icon && (
        <div className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-neutral-400">
          <Icon size={18} />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-neutral-700">{title}</p>
        {description && <p className="mt-0.5 text-xs text-neutral-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
