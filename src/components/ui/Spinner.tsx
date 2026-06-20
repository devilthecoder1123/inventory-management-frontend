import { Loader2 } from 'lucide-react';

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-neutral-400">
      <Spinner className="h-7 w-7 text-primary-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
