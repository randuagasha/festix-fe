import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-6 w-44 rounded-md" />
        <Skeleton className="h-3.5 w-72 rounded-md" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
              <Skeleton className="mt-2 h-7 w-20 rounded-md" />
            </div>
            <Skeleton className="mt-3 h-5 w-24 rounded-md" />
          </div>
        ))}
      </div>

      {/* Revenue / Orders Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-4 w-36 rounded-md" />
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-xs"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-5 w-28 rounded-md" />
                </div>
                <Skeleton className="size-8 rounded-lg" />
              </div>
              <Skeleton className="h-52 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Operations (Ticket & Payment) Skeleton */}
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Ticket Operations */}
        <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3 space-y-2">
                  <Skeleton className="h-3 w-14 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-2.5 w-20 rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>

        {/* Payment Distribution */}
        <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
              </div>
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16 rounded-md" />
                    <Skeleton className="h-3 w-12 rounded-md" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        </div>
      </div>

      {/* Event Analytics Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-xs"
            >
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid gap-3 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/80 bg-card p-4 shadow-xs"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
            <div className="divide-y divide-border/60">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-36 rounded-md" />
                    <Skeleton className="h-2.5 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
