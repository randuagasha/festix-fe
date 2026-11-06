"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Ticket } from "lucide-react";

interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: string;
  quota: number;
  availableQuota: number;
  createdAt: string;
  updatedAt: string;
}

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
  location: string;
  coverImageUrl: string;
  startDatetime: string;
  category: EventCategory;
  ticketTypes: TicketType[];
}

interface FeaturedEventsProps {
  events?: Event[];
}

function formatPrice(ticketTypes: TicketType[]): string {
  if (!ticketTypes || ticketTypes.length === 0) return "Gratis";
  const prices = ticketTypes
    .map((t) => Number(t.price))
    .filter((p) => !isNaN(p));
  if (prices.length === 0) return "Gratis";
  const min = Math.min(...prices);
  if (min === 0) return "Gratis";
  return `Rp ${min.toLocaleString("id-ID")}`;
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

export function FeaturedEvents({ events = [] }: FeaturedEventsProps) {
  return (
    <section className="bg-white py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Acara Unggulan
            </h2>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Event terpopuler dengan antusiasme penonton tertinggi saat ini.
            </p>
          </div>

          <Link href="/customers/events">
            <Button
              variant="ghost"
              size="sm"
              className="font-sans text-xs font-semibold text-primary hover:text-primary/90 hover:bg-primary/5 gap-1.5 self-start sm:self-auto"
            >
              Lihat Semua Event
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={event.coverImageUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {event.category?.name && (
                    <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 font-sans text-[11px] font-semibold text-foreground shadow-xs backdrop-blur-sm">
                      {event.category.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <div className="mt-2.5 space-y-1.5 font-sans text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3.5 shrink-0 text-primary" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 shrink-0 text-primary" />
                        <span>{formatDate(event.startDatetime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-3.5">
                    <div>
                      <p className="font-sans text-[11px] text-muted-foreground">Harga Tiket</p>
                      <p className="font-heading text-sm font-bold text-primary">
                        {formatPrice(event.ticketTypes)}
                      </p>
                    </div>

                    <span className="flex items-center gap-1 font-sans text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      Detail
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
            <div className="text-center">
              <Ticket className="mx-auto size-8 text-muted-foreground/60 mb-2" />
              <p className="font-sans text-sm text-muted-foreground">
                Belum ada acara unggulan saat ini.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
