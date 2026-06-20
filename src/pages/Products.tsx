import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftRight, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { categoryApi, productApi, stockApi, supplierApi, type ProductQuery } from '../api/services';
import { ProductFormModal, type ProductFormValues } from '../components/forms/ProductFormModal';
import { StockMovementModal } from '../components/forms/StockMovementModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { PageLoader } from '../components/ui/Spinner';
import { StockBadge } from '../components/ui/StockBadge';
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

  const { data, isLoading } = useQuery({
    queryKey: ['products', query],
    queryFn: () => productApi.list(query),
  });
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Products</h2>
          <p className="text-sm text-slate-500">Manage your inventory items</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            className="input pl-9"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="input w-auto"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input w-auto"
          value={supplierId}
          onChange={(e) => {
            setSupplierId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All suppliers</option>
          {suppliers?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => {
              setLowStock(e.target.checked);
              setPage(1);
            }}
          />
          Low stock only
        </label>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <PageLoader />
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-400">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.category?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{p.quantity}</td>
                    <td className="px-4 py-3">
                      <StockBadge product={p} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Adjust stock"
                          className="rounded p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                          onClick={() => setStockTarget(p)}
                        >
                          <ArrowLeftRight size={16} />
                        </button>
                        <button
                          title="Edit"
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          onClick={() => {
                            setEditing(p);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        {user?.role === 'ADMIN' && (
                          <button
                            title="Delete"
                            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <Trash2 size={16} />
                          </button>
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
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
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
