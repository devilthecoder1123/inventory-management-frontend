import { useEffect, useState } from 'react';
import type { MovementType, Product } from '../../types';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { type: MovementType; quantity: number; note: string }) => void;
  saving: boolean;
  product: Product | null;
}

const types: { value: MovementType; label: string; hint: string }[] = [
  { value: 'IN', label: 'Stock In', hint: 'Add units to inventory' },
  { value: 'OUT', label: 'Stock Out', hint: 'Remove units from inventory' },
  { value: 'ADJUSTMENT', label: 'Adjustment', hint: 'Set the exact on-hand quantity' },
];

export function StockMovementModal({ open, onClose, onSubmit, saving, product }: Props) {
  const [type, setType] = useState<MovementType>('IN');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setType('IN');
      setQuantity(1);
      setNote('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, quantity, note });
  };

  const activeHint = types.find((t) => t.value === type)?.hint;

  return (
    <Modal open={open} onClose={onClose} title={`Stock Movement — ${product?.name ?? ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Current on-hand: <span className="font-semibold text-slate-800">{product?.quantity ?? 0}</span> units
        </div>

        <div>
          <label className="label">Movement Type</label>
          <div className="grid grid-cols-3 gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                  type === t.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-400">{activeHint}</p>
        </div>

        <div>
          <label className="label">{type === 'ADJUSTMENT' ? 'New Quantity' : 'Quantity'}</label>
          <input
            type="number"
            min={type === 'ADJUSTMENT' ? 0 : 1}
            className="input"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="label">Note (optional)</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Purchase order #123" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />} Record movement
          </button>
        </div>
      </form>
    </Modal>
  );
}
