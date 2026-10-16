import { Suspense } from "react";
import { EventDetailContent } from "@/components/event-detail/event-detail-content";
import { EventDetailSkeleton } from "@/components/event-detail/event-detail-skeleton";

export default function SingularEventDetailPage() {
  return (
    <Suspense fallback={<EventDetailSkeleton />}>
      <EventDetailContent />
    </Suspense>
  );
}
