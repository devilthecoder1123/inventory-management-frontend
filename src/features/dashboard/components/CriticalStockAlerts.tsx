import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { EmptyState } from '../../../components/ui/empty-state';
import { Progress } from '../../../components/ui/progress';
import type { CriticalAlert } from '../types';

export function CriticalStockAlerts({ alerts }: { alerts: CriticalAlert[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Critical Stock Alerts</CardTitle>
          {alerts.length > 0 && <Badge variant="danger">{alerts.length}</Badge>}
        </div>
        <Link to="/products?lowStock=true" className="text-xs font-medium text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pt-1">
        {alerts.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="Everything is well stocked" description="No products below reorder level" compact />
        ) : (
          <ul className="divide-y divide-neutral-100">
            {alerts.map((a) => {
              const ratio = a.reorderLevel > 0 ? Math.min(100, (a.quantity / a.reorderLevel) * 100) : 0;
              const isOut = a.severity === 'out';
              return (
                <li key={a.id}>
                  <Link
                    to="/products?lowStock=true"
                    className="group flex items-center gap-3 py-2.5 transition-colors hover:bg-neutral-50/60 -mx-1 px-1 rounded-md"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-neutral-800">{a.name}</p>
                        <Badge variant={isOut ? 'danger' : 'warning'}>{isOut ? 'Out of stock' : 'Low'}</Badge>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress
                          value={ratio}
                          className="h-1.5 max-w-[140px]"
                          indicatorClassName={isOut ? 'bg-danger-500' : 'bg-warning-500'}
                          aria-label={`${a.name} stock level`}
                        />
                        <span className="text-2xs text-neutral-400 tabular-nums">
                          {a.quantity}/{a.reorderLevel}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-2xs text-neutral-400">{a.sku}</span>
                    <ChevronRight size={15} className="text-neutral-300 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
