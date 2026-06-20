import { Gauge, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { EmptyState } from '../../../components/ui/empty-state';
import { formatCompactNumber } from '../../../lib/format';
import { cn } from '../../../lib/cn';
import type { MoverProduct } from '../types';

interface MoversListProps {
  title: string;
  subtitle: string;
  items: MoverProduct[];
  variant: 'fast' | 'slow';
}

export function MoversList({ title, subtitle, items, variant }: MoversListProps) {
  const isFast = variant === 'fast';
  const max = Math.max(1, ...items.map((i) => i.unitsOut));

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-1">
        {items.length === 0 ? (
          <EmptyState icon={isFast ? TrendingUp : Gauge} title="Not enough data" compact />
        ) : (
          <ol className="space-y-2.5">
            {items.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-md text-2xs font-semibold tabular-nums',
                    isFast ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500',
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-800">{p.name}</p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={cn('h-full rounded-full', isFast ? 'bg-success-500' : 'bg-neutral-300')}
                      style={{ width: `${isFast ? (p.unitsOut / max) * 100 : 100 - (p.unitsOut / max) * 100 || 6}%` }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-right text-xs">
                  <span className="font-semibold text-neutral-800 tabular-nums">{formatCompactNumber(p.unitsOut)}</span>
                  <span className="ml-1 text-neutral-400">out</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
