import { ArrowDownLeft, ArrowUpRight, Inbox, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { EmptyState } from '../../../components/ui/empty-state';
import { formatRelativeTime } from '../../../lib/format';
import { cn } from '../../../lib/cn';
import type { MovementType, StockMovement } from '../../../types';

const META: Record<MovementType, { icon: typeof ArrowUpRight; ring: string; sign: string; color: string }> = {
  IN: { icon: ArrowUpRight, ring: 'bg-success-50 text-success-600', sign: '+', color: 'text-success-600' },
  OUT: { icon: ArrowDownLeft, ring: 'bg-danger-50 text-danger-600', sign: '−', color: 'text-danger-600' },
  ADJUSTMENT: { icon: RefreshCw, ring: 'bg-warning-50 text-warning-600', sign: '=', color: 'text-warning-600' },
};

export function RecentTransactions({ movements }: { movements: StockMovement[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <Link to="/stock-movements" className="text-xs font-medium text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pt-1">
        {movements.length === 0 ? (
          <EmptyState icon={Inbox} title="No transactions yet" compact />
        ) : (
          <ul className="divide-y divide-neutral-100">
            {movements.map((m) => {
              const meta = META[m.type];
              const Icon = meta.icon;
              return (
                <li key={m.id} className="flex items-center gap-3 py-2.5">
                  <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full', meta.ring)}>
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-800">{m.product?.name}</p>
                    <p className="truncate text-xs text-neutral-400">
                      {m.user?.name ?? 'System'} · {formatRelativeTime(m.createdAt)}
                    </p>
                  </div>
                  <span className={cn('shrink-0 text-sm font-semibold tabular-nums', meta.color)}>
                    {meta.sign}
                    {m.quantity}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
