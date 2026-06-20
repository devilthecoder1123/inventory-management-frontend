import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { categoryApi, supplierApi } from '../../api/services';
import type { Product } from '../../types';
import { Button } from '../ui/button';
import { FormField } from '../ui/field';
import { Input } from '../ui/input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/select';
import { Spinner } from '../ui/Spinner';
import { Textarea } from '../ui/textarea';

const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(64),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(1000).optional(),
  price: z.number().min(0, 'Cannot be negative'),
  costPrice: z.number().min(0, 'Cannot be negative'),
  quantity: z.number().int('Whole numbers only').min(0, 'Cannot be negative'),
  reorderLevel: z.number().int('Whole numbers only').min(0, 'Cannot be negative'),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

const DEFAULTS: ProductFormValues = {
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

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
  saving: boolean;
  initial?: Product | null;
}

export function ProductFormModal({ open, onClose, onSubmit, saving, initial }: Props) {
  const isEdit = Boolean(initial);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULTS,
  });

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list, enabled: open });
  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: supplierApi.list, enabled: open });

  useEffect(() => {
    if (!open) return;
    reset(
      initial
        ? {
            sku: initial.sku,
            name: initial.name,
            description: initial.description ?? '',
            price: Number(initial.price),
            costPrice: Number(initial.costPrice),
            quantity: initial.quantity,
            reorderLevel: initial.reorderLevel,
            categoryId: initial.categoryId ?? '',
            supplierId: initial.supplierId ?? '',
          }
        : DEFAULTS,
    );
  }, [initial, open, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit product' : 'Add product'}
      description={isEdit ? 'Update product details' : 'Create a new inventory item'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="SKU" required error={errors.sku?.message}>
            <Input placeholder="ELE-001" disabled={isEdit} {...register('sku')} />
          </FormField>
          <FormField label="Name" required error={errors.name?.message}>
            <Input placeholder="Wireless Mouse" {...register('name')} />
          </FormField>
        </div>

        <FormField label="Description" error={errors.description?.message}>
          <Textarea rows={2} placeholder="Optional notes about this product" {...register('description')} />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Selling price (₹)" error={errors.price?.message}>
            <Input type="number" step="0.01" min="0" {...register('price', { valueAsNumber: true })} />
          </FormField>
          <FormField label="Cost price (₹)" error={errors.costPrice?.message}>
            <Input type="number" step="0.01" min="0" {...register('costPrice', { valueAsNumber: true })} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Quantity"
            error={errors.quantity?.message}
            hint={isEdit ? 'Use stock movements to change quantity' : undefined}
          >
            <Input type="number" min="0" disabled={isEdit} {...register('quantity', { valueAsNumber: true })} />
          </FormField>
          <FormField label="Reorder level" error={errors.reorderLevel?.message}>
            <Input type="number" min="0" {...register('reorderLevel', { valueAsNumber: true })} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Category" error={errors.categoryId?.message}>
            <Select {...register('categoryId')}>
              <option value="">— None —</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Supplier" error={errors.supplierId?.message}>
            <Select {...register('supplierId')}>
              <option value="">— None —</option>
              {suppliers?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />}
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
