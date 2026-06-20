import {
  ArrowLeftRight,
  Boxes,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Tags,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/cn';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/stock-movements', label: 'Stock Movements', icon: ArrowLeftRight },
];

export function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-neutral-200 bg-white transition-transform md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-neutral-200 px-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-600 text-white">
            <Boxes className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold tracking-tight text-neutral-900">IMS</span>
        </div>
        <nav className="space-y-0.5 p-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-neutral-900/30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-2.5 md:hidden">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100">
              <Menu size={22} />
            </button>
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-600 text-white">
              <Boxes className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-neutral-900">IMS</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-700">{user?.name}</p>
              <p className="text-2xs uppercase tracking-wide text-neutral-400">{user?.role}</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              title="Logout"
              aria-label="Logout"
              className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-danger-600"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
