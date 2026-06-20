import { Skeleton } from './skeleton';

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3.5">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={c === 0 ? 'h-4 flex-[2]' : 'h-4 flex-1'} />
          ))}
        </div>
      ))}
    </div>
  );
}
