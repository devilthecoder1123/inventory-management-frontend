import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { formatCompactCurrency, formatCurrency, formatDayLabel } from '../../../lib/format';
import { CHART } from '../chart-theme';
import { ChartTooltip } from './ChartTooltip';
import type { TrendPoint } from '../types';

export function InventoryValueTrendChart({ series, days }: { series: TrendPoint[]; days: number }) {
  const { current, deltaPct, up } = useMemo(() => {
    const first = series[0]?.value ?? 0;
    const last = series[series.length - 1]?.value ?? 0;
    const pct = first > 0 ? ((last - first) / first) * 100 : 0;
    return { current: last, deltaPct: pct, up: last >= first };
  }, [series]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div>
          <CardTitle>Inventory Value</CardTitle>
          <p className="mt-0.5 text-xs text-neutral-500">Estimated · last {days} days</p>
        </div>
        <Badge variant={up ? 'success' : 'danger'}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {deltaPct >= 0 ? '+' : ''}
          {deltaPct.toFixed(1)}%
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 pt-1">
        <p className="text-2xl font-semibold tracking-tight text-neutral-900 tabular-nums">
          {formatCurrency(current)}
        </p>
        <ResponsiveContainer width="100%" height={176}>
          <AreaChart data={series} margin={{ top: 12, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.25} />
                <stop offset="100%" stopColor={CHART.primary} stopOpacity={0} />
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
            <YAxis
              tickFormatter={(v) => formatCompactCurrency(v)}
              tick={{ fontSize: 11, fill: CHART.axis }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              content={({ active, label, payload }) => (
                <ChartTooltip
                  active={active}
                  label={label as string}
                  rows={(payload ?? []).map((p) => ({
                    name: 'Value',
                    value: formatCurrency(p.value as number),
                    color: CHART.primary,
                  }))}
                />
              )}
            />
            <Area type="monotone" dataKey="value" stroke={CHART.primary} strokeWidth={2} fill="url(#gValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
