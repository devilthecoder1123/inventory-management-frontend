import { Card } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';

function CardSkeleton({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <Card className={className}>
      <div className="space-y-3 p-5">{children}</div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <CardSkeleton className="col-span-12 lg:col-span-3">
          <Skeleton className="mx-auto h-32 w-32 rounded-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </CardSkeleton>

        <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i}>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-3 w-16" />
            </CardSkeleton>
          ))}
        </div>

        <CardSkeleton className="col-span-12 lg:col-span-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardSkeleton>

        <CardSkeleton className="col-span-12 lg:col-span-7">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-48 w-full" />
        </CardSkeleton>
        <CardSkeleton className="col-span-12 lg:col-span-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-48 w-full" />
        </CardSkeleton>
      </div>
    </div>
  );
}
