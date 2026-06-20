import { useQuery } from '@tanstack/react-query';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { stockApi, type MovementQuery } from '../api/services';
import { Pagination } from '../components/ui/Pagination';
import { PageLoader } from '../components/ui/Spinner';
import { formatDate } from '../lib/format';
import type { MovementType } from '../types';

const meta: Record<MovementType, { icon: typeof ArrowUpCircle; cls: string; label: string; sign: string }> = {
  IN: { icon: ArrowUpCircle, cls: 'text-emerald-600 bg-emerald-50', label: 'Stock In', sign: '+' },
  OUT: { icon: ArrowDownCircle, cls: 'text-red-600 bg-red-50', label: 'Stock Out', sign: '-' },
  ADJUSTMENT: { icon: RefreshCw, cls: 'text-amber-600 bg-amber-50', label: 'Adjustment', sign: '=' },
};

export default function StockMovements() {
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const query: MovementQuery = { type: type || undefined, page, limit: 15 };
  const { data, isLoading } = useQuery({
    queryKey: ['movements', query],
    queryFn: () => stockApi.list(query),
  });

  const movements = data?.data ?? [];
  const pageMeta = data?.meta;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Stock Movements</h2>
          <p className="text-sm text-slate-500">Full history of inventory changes</p>
        </div>
        <select
          className="input w-auto"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All types</option>
          <option value="IN">Stock In</option>
          <option value="OUT">Stock Out</option>
          <option value="ADJUSTMENT">Adjustment</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <PageLoader />
        ) : movements.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-400">No stock movements recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">By</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((m) => {
                  const cfg = meta[m.type];
                  const Icon = cfg.icon;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className={`badge ${cfg.cls}`}>
                          <Icon size={14} className="mr-1" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{m.product?.name}</p>
                        <p className="text-xs text-slate-400">{m.product?.sku}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {cfg.sign}
                        {m.quantity}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{m.note || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{m.user?.name || '—'}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(m.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {pageMeta && pageMeta.total > 0 && (
          <Pagination
            page={pageMeta.page}
            totalPages={pageMeta.totalPages}
            total={pageMeta.total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
