"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EventDiscoverCard } from "@/components/events/event-discover-card";
import type { Event } from "@/lib/event-types";

type EventsGridProps = {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
};

export function EventsGrid({
  events,
  isLoading,
  isError,
  onRetry,
  onClearFilters,
}: EventsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border bg-card">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-12 text-center">
        <h3 className="font-heading text-lg font-bold">Failed to load events</h3>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Something went wrong while fetching events. Please try again.
        </p>
        <Button onClick={onRetry} className="mt-4" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-12 text-center">
        <h3 className="font-heading text-lg font-bold">No events found</h3>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Try adjusting your search or filters to discover more events.
        </p>
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="mt-4"
          size="sm"
        >
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventDiscoverCard key={event.id} event={event} />
      ))}
    </div>
  );
}
