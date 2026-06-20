import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { categoryApi } from '../api/services';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/empty-state';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';
import type { Category } from '../types';

export default function Categories() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });

  useEffect(() => {
    setName(editing?.name ?? '');
    setDescription(editing?.description ?? '');
  }, [editing, formOpen]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] });

  const saveMutation = useMutation({
    mutationFn: () =>
      editing ? categoryApi.update(editing.id, { name, description }) : categoryApi.create({ name, description }),
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
        actions={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={16} /> Add Category
          </Button>
        }
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-700" onClick={() => { setEditing(c); setFormOpen(true); }}>
                          <Pencil size={15} />
                        </Button>
                        {user?.role === 'ADMIN' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-danger-600" onClick={() => setDeleteTarget(c)}>
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
            action={<Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus size={15} /> Add Category</Button>}
          />
        )}
      </Card>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Spinner className="h-4 w-4" />} Save
            </Button>
          </div>
        </form>
      </Modal>

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
