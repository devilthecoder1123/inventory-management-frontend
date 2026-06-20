import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supplierApi } from '../api/services';
import { SupplierFormModal, type SupplierFormValues } from '../components/forms/SupplierFormModal';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/empty-state';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';
import type { Supplier } from '../types';

export default function Suppliers() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ['suppliers'], queryFn: supplierApi.list });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['suppliers'] });

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (s: Supplier) => { setEditing(s); setFormOpen(true); };

  const saveMutation = useMutation({
    mutationFn: (values: SupplierFormValues) =>
      editing ? supplierApi.update(editing.id, values) : supplierApi.create(values),
    onSuccess: () => {
      toast.success(editing ? 'Supplier updated' : 'Supplier created');
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => supplierApi.remove(id),
    onSuccess: () => {
      toast.success('Supplier deleted');
      setDeleteTarget(null);
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Suppliers"
        description="Manage your vendors"
        actions={<Button onClick={openCreate}><Plus size={16} /> Add Supplier</Button>}
      />

      <Card className="overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50/60 text-left text-2xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Email</th>
                  <th className="px-4 py-2.5 font-medium">Phone</th>
                  <th className="px-4 py-2.5 font-medium">Products</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-neutral-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-neutral-100 text-2xs font-semibold text-neutral-600">
                          {s.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="font-medium text-neutral-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{s.email || '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">{s.phone || '—'}</td>
                    <td className="px-4 py-3"><Badge variant="neutral">{s._count?.products ?? 0}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-700" title="Edit" onClick={() => openEdit(s)}>
                          <Pencil size={15} />
                        </Button>
                        {user?.role === 'ADMIN' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-danger-600" title="Delete" onClick={() => setDeleteTarget(s)}>
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
            icon={Truck}
            title="No suppliers yet"
            description="Add a supplier to track where stock comes from."
            action={<Button size="sm" onClick={openCreate}><Plus size={15} /> Add Supplier</Button>}
          />
        )}
      </Card>

      <SupplierFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={(v) => saveMutation.mutate(v)}
        saving={saveMutation.isPending}
        initial={editing}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        message={`Delete supplier "${deleteTarget?.name}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
