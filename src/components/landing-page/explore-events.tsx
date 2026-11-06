"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Compass } from "lucide-react";

interface EventCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  coverImageUrl: string;
  category: EventCategory;
  location: string;
  startDatetime: string;
}

interface ExploreEventsProps {
  events?: Event[];
  categories?: EventCategory[];
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function ExploreEvents({
  events = [],
  categories = [],
}: ExploreEventsProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter((event) => event.category?.name === activeCategory);

  return (
    <section className="bg-[#EBF5FF]/50 py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Jelajahi Kategori
            </h2>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Pilih kategori favoritmu untuk menemukan jadwal event yang cocok.
            </p>
          </div>

          <Link href="/customers/events">
            <Button
              variant="outline"
              size="sm"
              className="font-sans text-xs font-semibold border-border bg-white text-foreground hover:bg-muted gap-1.5 self-start sm:self-auto"
            >
              Katalog Lengkap
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={`shrink-0 rounded-lg px-4 py-2 font-sans text-xs font-semibold transition-all ${
              activeCategory === "All"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-border text-foreground hover:border-primary/40 hover:bg-white"
            }`}
          >
            Semua ({events.length})
          </button>

          {categories.map((category) => {
            const count = events.filter((e) => e.category?.name === category.name).length;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.name)}
                className={`shrink-0 rounded-lg px-4 py-2 font-sans text-xs font-semibold transition-all ${
                  activeCategory === category.name
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white border border-border text-foreground hover:border-primary/40 hover:bg-white"
                }`}
              >
                {category.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Event Grid (4 Columns) */}
        {filteredEvents.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={event.coverImageUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {event.category?.name && (
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-white/95 px-2 py-0.5 font-sans text-[10px] font-semibold text-foreground shadow-2xs backdrop-blur-sm">
                      {event.category.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <div className="mt-2 space-y-1 font-sans text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3 shrink-0 text-primary" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3 shrink-0 text-primary" />
                        <span>{formatDate(event.startDatetime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="font-sans text-[11px] font-semibold text-primary">
                      Lihat Tiket
                    </span>
                    <ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-border bg-white/60">
            <div className="text-center">
              <Compass className="mx-auto size-7 text-muted-foreground/60 mb-2" />
              <p className="font-sans text-xs text-muted-foreground">
                Tidak ada event pada kategori ini.
              </p>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 flex justify-center">
          <Link href="/customers/events">
            <Button
              className="bg-primary text-white hover:bg-primary/90 font-sans text-xs font-semibold px-6 h-10 rounded-lg gap-2"
            >
              Jelajahi Semua Event
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
