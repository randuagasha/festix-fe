import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Event } from "@/components/home/home-page";
import { PopularEventRow } from "@/components/home/popular-event-row";

type PopularEventsProps = {
  events: Event[];
};

export function PopularEvents({
  events,
}: PopularEventsProps) {
  return (
    <section className="border-t px-6 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Trending
            </p>

            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Popular events
            </h2>
          </div>

          <Link
            href="/events"
            className="flex items-center gap-1 font-sans text-sm font-medium hover:text-primary"
          >
            Explore all
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="border-t">
          {events.slice(0, 6).map((event) => (
            <PopularEventRow
              key={event.id}
              event={event}
            />
          ))}
        </div>
      </div>
    </section>
  );
}