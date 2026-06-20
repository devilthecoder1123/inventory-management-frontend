import { Boxes, LineChart, PackageCheck, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

const HIGHLIGHTS = [
  { icon: PackageCheck, title: 'Real-time stock control', desc: 'Track every unit with a full movement ledger.' },
  { icon: LineChart, title: 'Operational insight', desc: 'Health score, trends and low-stock alerts at a glance.' },
  { icon: ShieldCheck, title: 'Role-based access', desc: 'Admin and staff permissions, secured with JWT.' },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-neutral-900 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-600">
            <Boxes className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Inventory</span>
        </div>

        <div className="relative max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Inventory management,
              <br />
              built for operators.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Manage products, suppliers and stock movements with the clarity of a modern operations tool.
            </p>
          </div>
          <ul className="space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-primary-300">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-neutral-400">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-neutral-500">© {new Date().getFullYear()} Inventory Management System</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-neutral-50 p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
