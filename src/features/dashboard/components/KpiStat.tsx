import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { Card } from '../../../components/ui/card';

interface KpiStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Optional contextual delta shown under the value. */
  delta?: { value: string; direction: 'up' | 'down' | 'flat'; intent?: 'positive' | 'negative' | 'neutral' };
  hint?: string;
  iconClassName?: string;
}

export function KpiStat({ icon: Icon, label, value, delta, hint, iconClassName }: KpiStatProps) {
  const intent = delta?.intent ?? 'neutral';
  const deltaColor =
    intent === 'positive'
      ? 'text-success-600'
      : intent === 'negative'
        ? 'text-danger-600'
        : 'text-neutral-500';
  const DeltaIcon = delta?.direction === 'down' ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className="p-4 hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</span>
        <span className={cn('grid h-8 w-8 place-items-center rounded-lg', iconClassName)}>
          <Icon size={16} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-neutral-900 tabular-nums">{value}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        {delta && delta.direction !== 'flat' && (
          <span className={cn('inline-flex items-center gap-0.5 font-medium tabular-nums', deltaColor)}>
            <DeltaIcon size={13} />
            {delta.value}
          </span>
        )}
        {hint && <span className="text-neutral-400">{hint}</span>}
      </div>
    </Card>
  );
}
