import { Suspense } from "react";
import { MyTicketsContent } from "@/components/my-tickets/my-tickets-content";

export default function MyTicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-svh bg-background">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-9 w-48 rounded-2xl bg-muted" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-24 rounded-2xl bg-muted" />
                <div className="h-24 rounded-2xl bg-muted" />
                <div className="h-24 rounded-2xl bg-muted" />
              </div>
              <div className="h-64 rounded-3xl bg-muted" />
            </div>
          </div>
        </div>
      }
    >
      <MyTicketsContent />
    </Suspense>
  );
}
