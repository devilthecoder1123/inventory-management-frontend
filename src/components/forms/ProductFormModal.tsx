import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { categoryApi, supplierApi } from '../../api/services';
import type { Product } from '../../types';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';

export interface ProductFormValues {
  sku: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  quantity: number;
  reorderLevel: number;
  categoryId: string;
  supplierId: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
  saving: boolean;
  initial?: Product | null;
}

const empty: ProductFormValues = {
  sku: '',
  name: '',
  description: '',
  price: 0,
  costPrice: 0,
  quantity: 0,
  reorderLevel: 10,
  categoryId: '',
  supplierId: '',
};

export function ProductFormModal({ open, onClose, onSubmit, saving, initial }: Props) {
  const [values, setValues] = useState<ProductFormValues>(empty);

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list, enabled: open });
  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: supplierApi.list, enabled: open });

  useEffect(() => {
    if (initial) {
      setValues({
        sku: initial.sku,
        name: initial.name,
        description: initial.description ?? '',
        price: Number(initial.price),
        costPrice: Number(initial.costPrice),
        quantity: initial.quantity,
        reorderLevel: initial.reorderLevel,
        categoryId: initial.categoryId ?? '',
        supplierId: initial.supplierId ?? '',
      });
    } else {
      setValues(empty);
    }
  }, [initial, open]);

  const set = (key: keyof ProductFormValues, value: string | number) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isEdit = Boolean(initial);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">SKU *</label>
            <input className="input" value={values.sku} onChange={(e) => set('sku', e.target.value)} required disabled={isEdit} />
          </div>
          <div>
            <label className="label">Name *</label>
            <input className="input" value={values.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input"
            rows={2}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Selling Price (₹)</label>
            <input type="number" step="0.01" min="0" className="input" value={values.price} onChange={(e) => set('price', Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Cost Price (₹)</label>
            <input type="number" step="0.01" min="0" className="input" value={values.costPrice} onChange={(e) => set('costPrice', Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Quantity</label>
            <input
              type="number"
              min="0"
              className="input"
              value={values.quantity}
              onChange={(e) => set('quantity', Number(e.target.value))}
              disabled={isEdit}
            />
            {isEdit && <p className="mt-1 text-xs text-slate-400">Use stock movements to change quantity.</p>}
          </div>
          <div>
            <label className="label">Reorder Level</label>
            <input type="number" min="0" className="input" value={values.reorderLevel} onChange={(e) => set('reorderLevel', Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Category</label>
            <select className="input" value={values.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              <option value="">— None —</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Supplier</label>
            <select className="input" value={values.supplierId} onChange={(e) => set('supplierId', e.target.value)}>
              <option value="">— None —</option>
              {suppliers?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />} {isEdit ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
