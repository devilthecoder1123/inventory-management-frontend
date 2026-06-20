import { AlertTriangle, IndianRupee, Package, RefreshCw, Warehouse } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { cn } from '../../lib/cn';
import { formatCompactNumber, formatCurrency, formatNumber } from '../../lib/format';
import { CategoryDistribution } from './components/CategoryDistribution';
import { CriticalStockAlerts } from './components/CriticalStockAlerts';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { InventoryHealthScore } from './components/InventoryHealthScore';
import { InventoryValueTrendChart } from './components/InventoryValueTrendChart';
import { KpiStat } from './components/KpiStat';
import { MoversList } from './components/MoversList';
import { QuickActions } from './components/QuickActions';
import { RecentTransactions } from './components/RecentTransactions';
import { StockTrendChart } from './components/StockTrendChart';
import { TopSuppliers } from './components/TopSuppliers';
import { useDashboardAnalytics } from './hooks/useDashboardAnalytics';

const RANGES = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
] as const;

function RangeTabs({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5 shadow-xs">
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            value === r.value ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-800',
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const [range, setRange] = useState<number>(30);
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardAnalytics(range);

  const kpis = useMemo(() => {
    if (!data) return null;
    const netUnits = data.trends.series.reduce((s, p) => s + p.netUnits, 0);
    const first = data.trends.series[0]?.value ?? 0;
    const last = data.trends.series[data.trends.series.length - 1]?.value ?? 0;
    const valuePct = first > 0 ? ((last - first) / first) * 100 : 0;
    return { netUnits, valuePct };
  }, [data]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-danger-50 text-danger-600">
          <AlertTriangle size={22} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Couldn’t load the dashboard</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {(error as Error)?.message ?? 'Please check your connection and try again.'}
          </p>
        </div>
        <Button onClick={() => refetch()}>Retry</Button>
      </Card>
    );
  }

  const { summary, health } = data;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500">Operational overview of your inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <RangeTabs value={range} onChange={setRange} />
          <Button variant="secondary" size="icon" onClick={() => refetch()} aria-label="Refresh dashboard">
            <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
          </Button>
        </div>
      </header>

      {/* Row 1 — Health · KPIs · Quick actions */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3">
          <InventoryHealthScore health={health} />
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-6">
          <KpiStat
            icon={Package}
            label="Products"
            value={formatNumber(summary.totalProducts)}
            hint={`${summary.totalCategories} categories`}
            iconClassName="bg-primary-50 text-primary-600"
          />
          <KpiStat
            icon={Warehouse}
            label="Units in Stock"
            value={formatNumber(summary.totalStock)}
            delta={{
              value: `${kpis!.netUnits >= 0 ? '+' : ''}${formatCompactNumber(kpis!.netUnits)}`,
              direction: kpis!.netUnits === 0 ? 'flat' : kpis!.netUnits > 0 ? 'up' : 'down',
              intent: kpis!.netUnits >= 0 ? 'positive' : 'negative',
            }}
            hint={`in ${range}d`}
            iconClassName="bg-info-50 text-info-600"
          />
          <KpiStat
            icon={IndianRupee}
            label="Inventory Value"
            value={formatCurrency(summary.inventoryValue)}
            delta={{
              value: `${kpis!.valuePct >= 0 ? '+' : ''}${kpis!.valuePct.toFixed(1)}%`,
              direction: kpis!.valuePct === 0 ? 'flat' : kpis!.valuePct > 0 ? 'up' : 'down',
              intent: kpis!.valuePct >= 0 ? 'positive' : 'negative',
            }}
            hint={`in ${range}d`}
            iconClassName="bg-success-50 text-success-600"
          />
          <KpiStat
            icon={AlertTriangle}
            label="Needs Attention"
            value={formatNumber(summary.lowStockCount + summary.outOfStockCount)}
            hint={`${summary.outOfStockCount} out · ${summary.lowStockCount} low`}
            iconClassName={
              summary.outOfStockCount > 0 ? 'bg-danger-50 text-danger-600' : 'bg-warning-50 text-warning-600'
            }
          />
        </div>

        <div className="col-span-12 lg:col-span-3">
          <QuickActions />
        </div>
      </section>

      {/* Row 2 — Critical alerts · Recent transactions */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <CriticalStockAlerts alerts={data.criticalAlerts} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <RecentTransactions movements={data.recentMovements} />
        </div>
      </section>

      {/* Row 3 — Trends */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <StockTrendChart series={data.trends.series} days={data.windowDays} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <InventoryValueTrendChart series={data.trends.series} days={data.windowDays} />
        </div>
      </section>

      {/* Row 4 — Movers · Category mix */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <MoversList
            title="Fast Moving"
            subtitle={`Most shipped · last ${range}d`}
            items={data.fastMovers}
            variant="fast"
          />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <MoversList
            title="Slow Moving"
            subtitle="Tying up capital"
            items={data.slowMovers}
            variant="slow"
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <CategoryDistribution data={data.categoryDistribution} />
        </div>
      </section>

      {/* Row 5 — Suppliers */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <TopSuppliers suppliers={data.topSuppliers} />
        </div>
      </section>
    </div>
  );
}
