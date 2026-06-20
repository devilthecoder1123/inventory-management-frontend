import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { EmptyState } from '../../../components/ui/empty-state';
import { ArrowDownUp } from 'lucide-react';
import { formatCompactNumber, formatDayLabel } from '../../../lib/format';
import { CHART } from '../chart-theme';
import { ChartTooltip } from './ChartTooltip';
import type { TrendPoint } from '../types';

export function StockTrendChart({ series, days }: { series: TrendPoint[]; days: number }) {
  const totals = useMemo(
    () => series.reduce((a, p) => ({ in: a.in + p.stockIn, out: a.out + p.stockOut }), { in: 0, out: 0 }),
    [series],
  );
  const hasData = totals.in + totals.out > 0;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div>
          <CardTitle>Stock Movement</CardTitle>
          <p className="mt-0.5 text-xs text-neutral-500">Units in vs out · last {days} days</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-xs text-neutral-400">In</p>
            <p className="text-sm font-semibold text-success-600 tabular-nums">+{formatCompactNumber(totals.in)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400">Out</p>
            <p className="text-sm font-semibold text-danger-600 tabular-nums">−{formatCompactNumber(totals.out)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        {hasData ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={series} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.success} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={CHART.success} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.danger} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={CHART.danger} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDayLabel}
                tick={{ fontSize: 11, fill: CHART.axis }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis tick={{ fontSize: 11, fill: CHART.axis }} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                content={({ active, label, payload }) => (
                  <ChartTooltip
                    active={active}
                    label={label as string}
                    rows={(payload ?? []).map((p) => ({
                      name: p.name === 'stockIn' ? 'Stock In' : 'Stock Out',
                      value: p.value as number,
                      color: p.name === 'stockIn' ? CHART.success : CHART.danger,
                    }))}
                  />
                )}
              />
              <Area type="monotone" dataKey="stockIn" stroke={CHART.success} strokeWidth={2} fill="url(#gIn)" />
              <Area type="monotone" dataKey="stockOut" stroke={CHART.danger} strokeWidth={2} fill="url(#gOut)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState icon={ArrowDownUp} title="No stock movements yet" description={`Nothing recorded in the last ${days} days`} />
        )}
      </CardContent>
    </Card>
  );
}
