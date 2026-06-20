import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Category } from '../../types';
import { Button } from '../ui/button';
import { FormField } from '../ui/field';
import { Input } from '../ui/input';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import { Textarea } from '../ui/textarea';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(500).optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
  saving: boolean;
  initial?: Category | null;
}

export function CategoryFormModal({ open, onClose, onSubmit, saving, initial }: Props) {
  const isEdit = Boolean(initial);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (open) reset({ name: initial?.name ?? '', description: initial?.description ?? '' });
  }, [open, initial, reset]);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit category' : 'Add category'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Name" required error={errors.name?.message}>
          <Input placeholder="Electronics" {...register('name')} />
        </FormField>
        <FormField label="Description" error={errors.description?.message}>
          <Textarea rows={3} placeholder="Optional description" {...register('description')} />
        </FormField>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />}
            {isEdit ? 'Save changes' : 'Create category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
