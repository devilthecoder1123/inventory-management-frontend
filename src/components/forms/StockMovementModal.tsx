import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { MovementType, Product } from '../../types';
import { Button } from '../ui/button';
import { FormField } from '../ui/field';
import { Input } from '../ui/input';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import { cn } from '../../lib/cn';

const movementSchema = z
  .object({
    type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
    quantity: z.number().int('Whole numbers only'),
    note: z.string().max(500).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.type === 'ADJUSTMENT' ? val.quantity < 0 : val.quantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['quantity'],
        message: val.type === 'ADJUSTMENT' ? 'Cannot be negative' : 'Must be greater than zero',
      });
    }
  });

type MovementFormValues = z.infer<typeof movementSchema>;

const TYPES: { value: MovementType; label: string; hint: string }[] = [
  { value: 'IN', label: 'Stock In', hint: 'Add units to inventory' },
  { value: 'OUT', label: 'Stock Out', hint: 'Remove units from inventory' },
  { value: 'ADJUSTMENT', label: 'Adjust', hint: 'Set the exact on-hand quantity' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { type: MovementType; quantity: number; note: string }) => void;
  saving: boolean;
  product: Product | null;
}

export function StockMovementModal({ open, onClose, onSubmit, saving, product }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: { type: 'IN', quantity: 1, note: '' },
  });

  const type = watch('type');

  useEffect(() => {
    if (open) reset({ type: 'IN', quantity: 1, note: '' });
  }, [open, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Record stock movement" description={product?.name}>
      <form
        onSubmit={handleSubmit((v) => onSubmit({ type: v.type, quantity: v.quantity, note: v.note ?? '' }))}
        className="space-y-4"
        noValidate
      >
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
          <span className="text-neutral-500">Current on-hand</span>
          <span className="font-semibold text-neutral-900 tabular-nums">{product?.quantity ?? 0} units</span>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-neutral-700">Movement type</p>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                aria-pressed={type === t.value}
                onClick={() => setValue('type', t.value, { shouldValidate: true })}
                className={cn(
                  'rounded-lg border px-2 py-2 text-sm font-medium transition-colors',
                  type === t.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-neutral-400">{TYPES.find((t) => t.value === type)?.hint}</p>
        </div>

        <FormField label={type === 'ADJUSTMENT' ? 'New quantity' : 'Quantity'} required error={errors.quantity?.message}>
          <Input type="number" min={type === 'ADJUSTMENT' ? 0 : 1} {...register('quantity', { valueAsNumber: true })} />
        </FormField>

        <FormField label="Note" error={errors.note?.message}>
          <Input placeholder="e.g. Purchase order #1042" {...register('note')} />
        </FormField>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />}
            Record movement
          </Button>
        </div>
      </form>
    </Modal>
  );
}
