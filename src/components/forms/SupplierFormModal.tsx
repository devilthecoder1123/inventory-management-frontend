import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Supplier } from '../../types';
import { Button } from '../ui/button';
import { FormField } from '../ui/field';
import { Input } from '../ui/input';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import { Textarea } from '../ui/textarea';

const supplierSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
  phone: z.string().max(30).optional(),
  address: z.string().max(500).optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SupplierFormValues) => void;
  saving: boolean;
  initial?: Supplier | null;
}

export function SupplierFormModal({ open, onClose, onSubmit, saving, initial }: Props) {
  const isEdit = Boolean(initial);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: '', email: '', phone: '', address: '' },
  });

  useEffect(() => {
    if (open)
      reset({
        name: initial?.name ?? '',
        email: initial?.email ?? '',
        phone: initial?.phone ?? '',
        address: initial?.address ?? '',
      });
  }, [open, initial, reset]);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit supplier' : 'Add supplier'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Name" required error={errors.name?.message}>
          <Input placeholder="Acme Distributors" {...register('name')} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="sales@acme.com" {...register('email')} />
          </FormField>
          <FormField label="Phone" error={errors.phone?.message}>
            <Input placeholder="+91 90000 00000" {...register('phone')} />
          </FormField>
        </div>
        <FormField label="Address" error={errors.address?.message}>
          <Textarea rows={2} placeholder="City, country" {...register('address')} />
        </FormField>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />}
            {isEdit ? 'Save changes' : 'Create supplier'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
