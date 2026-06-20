import { useMemo } from 'react';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CHART } from '../chart-theme';
import type { HealthScore } from '../types';

const RATING_META: Record<HealthScore['rating'], { label: string; color: string; text: string }> = {
  excellent: { label: 'Excellent', color: CHART.success, text: 'text-success-600' },
  good: { label: 'Good', color: CHART.success, text: 'text-success-600' },
  fair: { label: 'Fair', color: CHART.warning, text: 'text-warning-600' },
  poor: { label: 'Poor', color: CHART.danger, text: 'text-danger-600' },
};

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-neutral-500">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="font-medium text-neutral-700 tabular-nums">{value}</span>
    </div>
  );
}

export function InventoryHealthScore({ health }: { health: HealthScore }) {
  const meta = RATING_META[health.rating];
  const data = useMemo(() => [{ name: 'score', value: health.score, fill: meta.color }], [health.score, meta.color]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Inventory Health</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center pt-1">
        <div className="relative h-36 w-36">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="74%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={-270}
              barSize={12}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: CHART.grid }} dataKey="value" cornerRadius={8} angleAxisId={0} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900 tabular-nums">
              {health.score}
            </span>
            <span className={`text-xs font-medium ${meta.text}`}>{meta.label}</span>
          </div>
        </div>

        <div className="mt-4 w-full space-y-1.5 border-t border-neutral-100 pt-3">
          <Legend color={CHART.success} label="Healthy" value={health.breakdown.healthy} />
          <Legend color={CHART.warning} label="Low stock" value={health.breakdown.low} />
          <Legend color={CHART.danger} label="Out of stock" value={health.breakdown.out} />
        </div>
      </CardContent>
    </Card>
  );
}
