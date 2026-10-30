import { Suspense } from "react";
import { EventsPage } from "@/components/events/events-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <EventsPage />
    </Suspense>
  );
}
