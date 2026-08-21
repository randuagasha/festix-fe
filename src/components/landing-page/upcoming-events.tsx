"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
// tinggal lu sambungin ya eki
interface Event {
  id: string;
  title: string;
  image: string;
  location: string;
  date: string;
  price: number;
}

interface UpcomingEventsProps {
  events?: Event[];
}

export function UpcomingEvents({
  events = [],
}: UpcomingEventsProps) {
  return (
    <section className="bg-[#eeeeee] py-24">
      <div className="container mx-auto px-6 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-sans text-sm font-medium uppercase tracking-[0.25em] text-primary">
              Coming Soon
            </p>

            <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
              Upcoming Events
            </h2>

            <p className="mt-4 max-w-xl font-sans text-muted-foreground">
              Dont miss whats coming next.
            </p>
          </div>

          <Link href="/events">
            <Button variant="ghost" className="font-sans">
              View Schedule
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
{/* tinggal lu sambungin ya eki */}
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-md md:flex-row"
              >
                <div className="h-56 w-full overflow-hidden bg-muted md:h-40 md:w-56">
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {event.date}
                    </p>

                    <h3 className="mt-2 font-heading text-2xl font-semibold">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-xs text-muted-foreground">
                      Starting from
                    </p>

                    <p className="mt-1 font-sans text-lg font-semibold">
                      ${event.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-border bg-white/50">
            <p className="font-sans text-sm text-muted-foreground">
              No upcoming events available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}