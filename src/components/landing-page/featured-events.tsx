"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  image: string;
  location: string;
  date: string;
  price: number;
}

interface FeaturedEventsProps {
  events?: Event[];
}

export function FeaturedEvents({ events = [] }: FeaturedEventsProps) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Acara Unggulan
            </h2>

            <p className="mt-4 max-w-xl font-sans text-muted-foreground">
              Temukan berbagai acara yang sedang ramai dibicarakan.
            </p>
          </div>

          <Link href="/events">
            <Button variant="ghost" className="font-sans">
              Lihat Semua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group overflow-hidden rounded-2xl border bg-background transition-shadow hover:shadow-lg"
              >
                <div className="aspect-4/3 overflow-hidden bg-muted">
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-xl font-semibold">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {event.location}
                  </p>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-sans font-semibold">${event.price}</p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {event.date}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed bg-muted/30">
            <p className="font-sans text-sm text-muted-foreground">
              No featured events available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
