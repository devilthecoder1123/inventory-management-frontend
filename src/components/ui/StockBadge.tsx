import type { Product } from '../../types';

export function StockBadge({ product }: { product: Pick<Product, 'quantity' | 'reorderLevel'> }) {
  const { quantity, reorderLevel } = product;
  let cls = 'bg-emerald-100 text-emerald-700';
  let label = 'In stock';
  if (quantity <= 0) {
    cls = 'bg-red-100 text-red-700';
    label = 'Out of stock';
  } else if (quantity <= reorderLevel) {
    cls = 'bg-amber-100 text-amber-700';
    label = 'Low stock';
  }
  return <span className={`badge ${cls}`}>{label}</span>;
}
