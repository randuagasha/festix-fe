import { Suspense } from "react";
import { TransactionDetailContent } from "@/components/transaction/transaction-detail-content";

function TransactionDetailSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded-xl bg-muted" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="h-48 rounded-2xl bg-muted" />
              <div className="h-32 rounded-2xl bg-muted" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-64 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionDetailPage() {
  return (
    <Suspense fallback={<TransactionDetailSkeleton />}>
      <TransactionDetailContent />
    </Suspense>
  );
}
