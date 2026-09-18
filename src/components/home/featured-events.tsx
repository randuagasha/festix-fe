import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Event } from "@/components/home/home-page";
import { FeaturedEventCard } from "@/components/home/featured-event-card";

type FeaturedEventsProps = {
  events: Event[];
};

export function FeaturedEvents({
  events,
}: FeaturedEventsProps) {
  return (
    <section className="px-6 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Upcoming
            </p>

            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Events worth seeing
            </h2>
          </div>

          <Link
            href="/events"
            className="hidden items-center gap-1 font-sans text-sm font-medium hover:text-primary sm:flex"
          >
            View all
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <FeaturedEventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        ) : (
          <div className="border py-20 text-center">
            <p className="font-sans text-sm text-muted-foreground">
              No events found.
            </p>
          </div>
        )}

        <Link
          href="/events"
          className="mt-6 flex items-center justify-center gap-1 border py-3 font-sans text-sm font-medium sm:hidden"
        >
          View all
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}