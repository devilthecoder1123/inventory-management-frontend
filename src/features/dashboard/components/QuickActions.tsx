import { ArrowLeftRight, PackagePlus, Tags, Truck, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

interface Action {
  to: string;
  label: string;
  icon: LucideIcon;
  className: string;
}

const CHIP = 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white';

const ACTIONS: Action[] = [
  { to: '/products', label: 'Add Product', icon: PackagePlus, className: CHIP },
  { to: '/stock-movements', label: 'Record Stock', icon: ArrowLeftRight, className: CHIP },
  { to: '/categories', label: 'New Category', icon: Tags, className: CHIP },
  { to: '/suppliers', label: 'New Supplier', icon: Truck, className: CHIP },
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
