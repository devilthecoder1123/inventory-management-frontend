import { useQuery } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, Inbox, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { stockApi, type MovementQuery } from '../api/services';
import { PageHeader } from '../components/PageHeader';
import { Badge, type BadgeProps } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { EmptyState } from '../components/ui/empty-state';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { cn } from '../lib/cn';
import { formatDate } from '../lib/format';
import type { MovementType } from '../types';

const meta: Record<
  MovementType,
  { icon: typeof ArrowUpRight; variant: BadgeProps['variant']; label: string; sign: string; color: string }
> = {
  IN: { icon: ArrowUpRight, variant: 'success', label: 'Stock In', sign: '+', color: 'text-success-600' },
  OUT: { icon: ArrowDownLeft, variant: 'danger', label: 'Stock Out', sign: '−', color: 'text-danger-600' },
  ADJUSTMENT: { icon: RefreshCw, variant: 'warning', label: 'Adjustment', sign: '=', color: 'text-warning-600' },
};

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Stock In', value: 'IN' },
  { label: 'Stock Out', value: 'OUT' },
  { label: 'Adjustment', value: 'ADJUSTMENT' },
];

export default function StockMovements() {
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const query: MovementQuery = { type: type || undefined, page, limit: 15 };
  const { data, isLoading } = useQuery({ queryKey: ['movements', query], queryFn: () => stockApi.list(query) });

  const movements = data?.data ?? [];
  const pageMeta = data?.meta;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Stock Movements"
        description="Full history of inventory changes"
        actions={
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5 shadow-xs">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setType(f.value); setPage(1); }}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  type === f.value ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-800',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      <Card className="overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : movements.length === 0 ? (
          <EmptyState icon={Inbox} title="No stock movements recorded" description="Record stock in/out from the Products page." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50/60 text-left text-2xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Product</th>
                  <th className="px-4 py-2.5 font-medium">Quantity</th>
                  <th className="px-4 py-2.5 font-medium">Note</th>
                  <th className="px-4 py-2.5 font-medium">By</th>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {movements.map((m) => {
                  const cfg = meta[m.type];
                  const Icon = cfg.icon;
                  return (
                    <tr key={m.id} className="transition-colors hover:bg-neutral-50/60">
                      <td className="px-4 py-3">
                        <Badge variant={cfg.variant}><Icon size={12} /> {cfg.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-800">{m.product?.name}</p>
                        <p className="font-mono text-2xs text-neutral-400">{m.product?.sku}</p>
                      </td>
                      <td className={cn('px-4 py-3 font-semibold tabular-nums', cfg.color)}>
                        {cfg.sign}{m.quantity}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{m.note || '—'}</td>
                      <td className="px-4 py-3 text-neutral-600">{m.user?.name || '—'}</td>
                      <td className="px-4 py-3 text-neutral-500">{formatDate(m.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {pageMeta && pageMeta.total > 0 && (
          <Pagination page={pageMeta.page} totalPages={pageMeta.totalPages} total={pageMeta.total} onPageChange={setPage} />
        )}
      </Card>
    </div>
  );
}
