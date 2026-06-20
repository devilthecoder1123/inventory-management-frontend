import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  IndianRupee,
  Package,
  RefreshCw,
  Tags,
  Truck,
  Warehouse,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/services';
import { PageLoader } from '../components/ui/Spinner';
import { StockBadge } from '../components/ui/StockBadge';
import { formatCurrency, formatDate, formatNumber } from '../lib/format';
import type { MovementType } from '../types';

const movementMeta: Record<MovementType, { icon: typeof ArrowUpCircle; cls: string; label: string }> = {
  IN: { icon: ArrowUpCircle, cls: 'text-emerald-600', label: 'Stock In' },
  OUT: { icon: ArrowDownCircle, cls: 'text-red-600', label: 'Stock Out' },
  ADJUSTMENT: { icon: RefreshCw, cls: 'text-amber-600', label: 'Adjustment' },
};

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${accent}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.stats });

  if (isLoading || !data) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Overview of your inventory</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total Products" value={formatNumber(data.totalProducts)} accent="bg-brand-100 text-brand-700" />
        <StatCard icon={Warehouse} label="Units in Stock" value={formatNumber(data.totalStock)} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={IndianRupee} label="Inventory Value" value={formatCurrency(data.inventoryValue)} accent="bg-violet-100 text-violet-700" />
        <StatCard icon={AlertTriangle} label="Low Stock Items" value={formatNumber(data.lowStockCount)} accent="bg-amber-100 text-amber-700" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={Tags} label="Categories" value={formatNumber(data.totalCategories)} accent="bg-sky-100 text-sky-700" />
        <StatCard icon={Truck} label="Suppliers" value={formatNumber(data.totalSuppliers)} accent="bg-rose-100 text-rose-700" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low stock */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h3 className="font-semibold text-slate-800">Low Stock Alerts</h3>
            <Link to="/products?lowStock=true" className="text-sm text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.lowStockProducts.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-slate-400">All products are well stocked 🎉</p>
            )}
            {data.lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {p.quantity} / {p.reorderLevel}
                  </span>
                  <StockBadge product={p} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent movements */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h3 className="font-semibold text-slate-800">Recent Stock Movements</h3>
            <Link to="/stock-movements" className="text-sm text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentMovements.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-slate-400">No movements yet</p>
            )}
            {data.recentMovements.map((m) => {
              const meta = movementMeta[m.type];
              const Icon = meta.icon;
              return (
                <div key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Icon className={meta.cls} size={20} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{m.product?.name}</p>
                      <p className="text-xs text-slate-400">{formatDate(m.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${meta.cls}`}>
                    {m.type === 'OUT' ? '-' : m.type === 'IN' ? '+' : '='}
                    {m.quantity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
