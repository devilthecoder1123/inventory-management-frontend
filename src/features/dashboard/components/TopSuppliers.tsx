import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { EmptyState } from '../../../components/ui/empty-state';
import { formatCurrency } from '../../../lib/format';
import type { SupplierDatum } from '../types';

export function TopSuppliers({ suppliers }: { suppliers: SupplierDatum[] }) {
  const max = Math.max(1, ...suppliers.map((s) => s.stockValue));

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Top Suppliers</CardTitle>
        <Link to="/suppliers" className="text-xs font-medium text-primary-600 hover:text-primary-700">
          Manage
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pt-1">
        {suppliers.length === 0 ? (
          <EmptyState icon={Truck} title="No suppliers yet" compact />
        ) : (
          <ul className="space-y-3">
            {suppliers.map((s) => (
              <li key={s.id}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-neutral-100 text-2xs font-semibold text-neutral-600">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate text-sm font-medium text-neutral-800">{s.name}</span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-neutral-900 tabular-nums">
                    {formatCurrency(s.stockValue)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 pl-9">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${(s.stockValue / max) * 100}%` }} />
                  </div>
                  <span className="text-2xs text-neutral-400">{s.productCount} SKUs</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
