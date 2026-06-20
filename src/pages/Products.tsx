import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftRight, Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { categoryApi, productApi, stockApi, supplierApi, type ProductQuery } from '../api/services';
import { PageHeader } from '../components/PageHeader';
import { ProductFormModal, type ProductFormValues } from '../components/forms/ProductFormModal';
import { StockMovementModal } from '../components/forms/StockMovementModal';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/empty-state';
import { Pagination } from '../components/ui/Pagination';
import { StockBadge } from '../components/ui/StockBadge';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';
import { formatCurrency } from '../lib/format';
import type { MovementType, Product } from '../types';

export default function Products() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [lowStock, setLowStock] = useState(searchParams.get('lowStock') === 'true');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [stockTarget, setStockTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const query: ProductQuery = useMemo(
    () => ({
      search: search || undefined,
      categoryId: categoryId || undefined,
      supplierId: supplierId || undefined,
      lowStock: lowStock || undefined,
      page,
      limit: 10,
    }),
    [search, categoryId, supplierId, lowStock, page],
  );

  const { data, isLoading } = useQuery({ queryKey: ['products', query], queryFn: () => productApi.list(query) });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: supplierApi.list });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['products'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: ProductFormValues) =>
      editing ? productApi.update(editing.id, values) : productApi.create(values),
    onSuccess: () => {
      toast.success(editing ? 'Product updated' : 'Product created');
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.remove(id),
    onSuccess: () => {
      toast.success('Product deleted');
      setDeleteTarget(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const stockMutation = useMutation({
    mutationFn: (v: { type: MovementType; quantity: number; note: string }) =>
      stockApi.create({ productId: stockTarget!.id, ...v }),
    onSuccess: () => {
      toast.success('Stock updated');
      setStockTarget(null);
      invalidate();
      qc.invalidateQueries({ queryKey: ['movements'] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;
  const hasFilters = Boolean(search || categoryId || supplierId || lowStock);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Products"
        description="Manage your inventory items"
        actions={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={16} /> Add Product
          </Button>
        }
      />

      {/* Filters */}
      <Card className="flex flex-wrap items-center gap-2.5 p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-neutral-400" size={16} />
          <input
            className="input pl-9"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="input w-auto" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input w-auto" value={supplierId} onChange={(e) => { setSupplierId(e.target.value); setPage(1); }}>
          <option value="">All suppliers</option>
          {suppliers?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button
          onClick={() => { setLowStock((v) => !v); setPage(1); }}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
            lowStock
              ? 'border-warning-300 bg-warning-50 text-warning-700'
              : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          Low stock only
        </button>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title={hasFilters ? 'No products match your filters' : 'No products yet'}
            description={hasFilters ? 'Try adjusting your search or filters.' : 'Add your first product to get started.'}
            action={
              !hasFilters && (
                <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
                  <Plus size={15} /> Add Product
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50/60 text-left text-2xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Product</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                  <th className="px-4 py-2.5 font-medium">Qty</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-neutral-50/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800">{p.name}</p>
                      <p className="font-mono text-2xs text-neutral-400">{p.sku}</p>
                    </td>
                    <td className="px-4 py-3">
                      {p.category ? <Badge variant="neutral">{p.category.name}</Badge> : <span className="text-neutral-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 tabular-nums">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800 tabular-nums">{p.quantity}</td>
                    <td className="px-4 py-3"><StockBadge product={p} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-primary-600" title="Adjust stock" onClick={() => setStockTarget(p)}>
                          <ArrowLeftRight size={15} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-700" title="Edit" onClick={() => { setEditing(p); setFormOpen(true); }}>
                          <Pencil size={15} />
                        </Button>
                        {user?.role === 'ADMIN' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-danger-600" title="Delete" onClick={() => setDeleteTarget(p)}>
                            <Trash2 size={15} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {meta && meta.total > 0 && (
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage} />
        )}
      </Card>

      <ProductFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={(v) => saveMutation.mutate(v)}
        saving={saveMutation.isPending}
        initial={editing}
      />
      <StockMovementModal
        open={Boolean(stockTarget)}
        onClose={() => setStockTarget(null)}
        onSubmit={(v) => stockMutation.mutate(v)}
        saving={stockMutation.isPending}
        product={stockTarget}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        message={`Delete "${deleteTarget?.name}"? This will also remove its stock history.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
