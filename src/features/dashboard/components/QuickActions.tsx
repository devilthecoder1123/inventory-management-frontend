import { ArrowLeftRight, PackagePlus, Tags, Truck, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

interface Action {
  to: string;
  label: string;
  icon: LucideIcon;
  className: string;
}

const ACTIONS: Action[] = [
  { to: '/products', label: 'Add Product', icon: PackagePlus, className: 'bg-primary-50 text-primary-700 group-hover:bg-primary-100' },
  { to: '/stock-movements', label: 'Record Stock', icon: ArrowLeftRight, className: 'bg-info-50 text-info-700 group-hover:bg-info-100' },
  { to: '/categories', label: 'New Category', icon: Tags, className: 'bg-success-50 text-success-700 group-hover:bg-success-100' },
  { to: '/suppliers', label: 'New Supplier', icon: Truck, className: 'bg-warning-50 text-warning-700 group-hover:bg-warning-100' },
];

export function QuickActions() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid flex-1 grid-cols-2 gap-2.5 pt-1">
        {ACTIONS.map(({ to, label, icon: Icon, className }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col items-start gap-2 rounded-lg border border-neutral-200 p-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            <span className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${className}`}>
              <Icon size={16} />
            </span>
            <span className="text-xs font-medium text-neutral-700">{label}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
