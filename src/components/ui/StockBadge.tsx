import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { Product } from '../../types';
import { Badge } from './badge';

export function StockBadge({ product }: { product: Pick<Product, 'quantity' | 'reorderLevel'> }) {
  const { quantity, reorderLevel } = product;
  if (quantity <= 0) {
    return (
      <Badge variant="danger">
        <XCircle size={12} /> Out of stock
      </Badge>
    );
  }
  if (quantity <= reorderLevel) {
    return (
      <Badge variant="warning">
        <AlertTriangle size={12} /> Low stock
      </Badge>
    );
  }
  return (
    <Badge variant="success">
      <CheckCircle2 size={12} /> In stock
    </Badge>
  );
}
