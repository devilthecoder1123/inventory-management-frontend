import { formatDayLabel } from '../../../lib/format';

interface TooltipRow {
  name: string;
  value: number | string;
  color: string;
}

/** Shared styled tooltip body for Recharts. */
export function ChartTooltip({
  active,
  label,
  rows,
}: {
  active?: boolean;
  label?: string;
  rows: TooltipRow[];
}) {
  if (!active || !rows.length) return null;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-md">
      {label && <p className="mb-1 text-2xs font-medium uppercase tracking-wide text-neutral-400">{formatDayLabel(label)}</p>}
      <div className="space-y-0.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
            <span className="text-neutral-500">{r.name}</span>
            <span className="ml-auto font-medium text-neutral-800 tabular-nums">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
