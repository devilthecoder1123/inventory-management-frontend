import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { categoryApi } from '../api/services';
import { CategoryFormModal, type CategoryFormValues } from '../components/forms/CategoryFormModal';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/empty-state';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';
import type { Category } from '../types';

export default function Categories() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] });

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setFormOpen(true); };

  const saveMutation = useMutation({
    mutationFn: (values: CategoryFormValues) =>
      editing ? categoryApi.update(editing.id, values) : categoryApi.create(values),
    onSuccess: () => {
      toast.success(editing ? 'Category updated' : 'Category created');
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.remove(id),
    onSuccess: () => {
      toast.success('Category deleted');
      setDeleteTarget(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Categories"
        description="Organize your products"
        actions={<Button onClick={openCreate}><Plus size={16} /> Add Category</Button>}
      />

      <Card className="overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50/60 text-left text-2xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                  <th className="px-4 py-2.5 font-medium">Products</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-neutral-50/60">
                    <td className="px-4 py-3 font-medium text-neutral-800">{c.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{c.description || '—'}</td>
                    <td className="px-4 py-3"><Badge variant="neutral">{c._count?.products ?? 0}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-700" title="Edit" onClick={() => openEdit(c)}>
                          <Pencil size={15} />
                        </Button>
                        {user?.role === 'ADMIN' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-danger-600" title="Delete" onClick={() => setDeleteTarget(c)}>
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
        ) : (
          <EmptyState
            icon={Tags}
            title="No categories yet"
            description="Create a category to organize products."
            action={<Button size="sm" onClick={openCreate}><Plus size={15} /> Add Category</Button>}
          />
        )}
      </Card>

      <CategoryFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={(v) => saveMutation.mutate(v)}
        saving={saveMutation.isPending}
        initial={editing}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        message={`Delete category "${deleteTarget?.name}"? Products will be uncategorized.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
