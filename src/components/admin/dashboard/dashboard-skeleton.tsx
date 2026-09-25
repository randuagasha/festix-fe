import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <Skeleton className="size-10 shrink-0 rounded-xl" />
              <div className="w-full space-y-1.5">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue / Orders Skeleton */}
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-4 w-48 rounded-md" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl">
          <CardContent className="flex items-center justify-between py-4">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-6 w-64 rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* Event Analytics Skeleton */}
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Snapshot Skeleton */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-52 rounded-md" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border p-4">
                <Skeleton className="mt-1 size-3 shrink-0 rounded-full" />
                <div className="w-full space-y-1.5">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Skeleton */}
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </CardHeader>
            <CardContent className="divide-y">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="h-3 w-28 rounded-md" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
