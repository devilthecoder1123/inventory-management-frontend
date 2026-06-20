import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { EmptyState } from '../../../components/ui/empty-state';
import { formatCurrency } from '../../../lib/format';
import { CATEGORY_PALETTE } from '../chart-theme';
import type { CategoryDatum } from '../types';

export function CategoryDistribution({ data }: { data: CategoryDatum[] }) {
  const { rows, total } = useMemo(() => {
    const t = data.reduce((s, c) => s + c.stockValue, 0);
    return { rows: data.slice(0, 6), total: t };
  }, [data]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div>
          <CardTitle>Category Distribution</CardTitle>
          <p className="mt-0.5 text-xs text-neutral-500">By stock value</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 items-center gap-4 pt-1">
        {rows.length === 0 ? (
          <EmptyState icon={Layers} title="No categories yet" compact className="mx-auto" />
        ) : (
          <>
            <div className="relative h-32 w-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={rows} dataKey="stockValue" nameKey="name" innerRadius={42} outerRadius={62} paddingAngle={2} stroke="none">
                    {rows.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs shadow-md">
                          <p className="font-medium text-neutral-800">{payload[0].name}</p>
                          <p className="text-neutral-500 tabular-nums">{formatCurrency(payload[0].value as number)}</p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xs text-neutral-400">Total</span>
                <span className="text-xs font-semibold text-neutral-700 tabular-nums">{formatCurrency(total)}</span>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5">
              {rows.map((c, i) => (
                <li key={c.id ?? c.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length] }} />
                  <span className="truncate text-neutral-600">{c.name}</span>
                  <span className="ml-auto shrink-0 font-medium text-neutral-800 tabular-nums">
                    {total > 0 ? Math.round((c.stockValue / total) * 100) : 0}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
