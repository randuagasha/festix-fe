"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
// tinggal lu sambungin ya eki
interface Event {
  id: string;
  title: string;
  image: string;
  category: string;
  location: string;
  date: string;
}

interface ExploreEventsProps {
  events?: Event[];
  categories?: string[];
}

export function ExploreEvents({
  events = [],
  categories = [],
}: ExploreEventsProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter((event) => event.category === activeCategory);

  return (
    <section className="bg-[#eeeeee] py-24">
      <div className="container mx-auto px-6 md:px-10">
        <div className="mb-10">
          <p className="mb-3 font-sans text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Discover
          </p>

          <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Explore Events
          </h2>

          <p className="mt-4 max-w-xl font-sans text-muted-foreground">
            Find an experience that matches your interests.
          </p>
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            onClick={() => setActiveCategory("All")}
            className="shrink-0 font-sans"
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={category}
              variant={
                activeCategory === category ? "default" : "outline"
              }
              onClick={() => setActiveCategory(category)}
              className="shrink-0 font-sans"
            >
              {category}
            </Button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="aspect-4/5 overflow-hidden bg-muted">
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    {event.category}
                  </p>

                  <h3 className="mt-2 font-heading text-lg font-semibold">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {event.location}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-white/50">
            <p className="font-sans text-sm text-muted-foreground">
              No events available.
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link href="/events">
            <Button variant="outline" className="font-sans">
              Explore All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}