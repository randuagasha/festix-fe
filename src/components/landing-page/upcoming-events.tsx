"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Ticket } from "lucide-react";

interface TicketType {
  price: string | number;
}

interface UpcomingEventItem {
  id: string;
  title: string;
  image?: string;
  coverImageUrl?: string;
  location: string;
  date?: string;
  startDatetime?: string;
  price?: number;
  ticketTypes?: TicketType[];
  category?: { name: string };
}

interface UpcomingEventsProps {
  events?: UpcomingEventItem[];
}

function parseSchedule(dateStr?: string) {
  if (!dateStr) return { day: "20", month: "NOV", fullDate: "Segera Hadir" };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: "20", month: "NOV", fullDate: dateStr };
    const day = d.getDate().toString().padStart(2, "0");
    const month = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(d).toUpperCase();
    const fullDate = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
    return { day, month, fullDate };
  } catch {
    return { day: "20", month: "NOV", fullDate: dateStr };
  }
}

function resolvePrice(item: UpcomingEventItem): string {
  if (item.ticketTypes && item.ticketTypes.length > 0) {
    const prices = item.ticketTypes
      .map((t) => Number(t.price))
      .filter((p) => !isNaN(p));
    if (prices.length > 0) {
      const min = Math.min(...prices);
      if (min === 0) return "Gratis";
      return `Rp ${min.toLocaleString("id-ID")}`;
    }
  }
  if (typeof item.price === "number") {
    if (item.price === 0) return "Gratis";
    return `Rp ${item.price.toLocaleString("id-ID")}`;
  }
  return "Tersedia";
}

export function UpcomingEvents({ events = [] }: UpcomingEventsProps) {
  const displayEvents = events.slice(0, 4);

  return (
    <section className="bg-white py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Jadwal Event Mendatang
            </h2>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Rencanakan akhir pekanmu dari sekarang dan amankan tiketmu lebih awal.
            </p>
          </div>

          <Link href="/customers/events">
            <Button
              variant="ghost"
              size="sm"
              className="font-sans text-xs font-semibold text-primary hover:text-primary/90 hover:bg-primary/5 gap-1.5 self-start sm:self-auto"
            >
              Lihat Semua Jadwal
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {displayEvents.length > 0 ? (
          <div className="space-y-3">
            {displayEvents.map((event) => {
              const imageSrc = event.coverImageUrl || event.image || "/images/hero.jpg";
              const schedule = parseSchedule(event.startDatetime || event.date);
              const priceLabel = resolvePrice(event);

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Date Block */}
                    <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-[#EBF5FF] text-foreground border border-border/80">
                      <span className="font-heading text-lg font-extrabold leading-none text-primary">
                        {schedule.day}
                      </span>
                      <span className="font-sans text-[10px] font-bold tracking-wider text-muted-foreground mt-0.5">
                        {schedule.month}
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={imageSrc}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      {event.category?.name && (
                        <span className="font-sans text-[11px] font-semibold text-primary">
                          {event.category.name}
                        </span>
                      )}
                      <h3 className="font-heading text-base font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0 text-muted-foreground" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-3 sm:border-t-0 sm:pt-0 shrink-0">
                    <div className="sm:text-right">
                      <p className="font-sans text-[11px] text-muted-foreground">Mulai dari</p>
                      <p className="font-heading text-sm font-bold text-primary">
                        {priceLabel}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/90 font-sans text-xs font-semibold px-4 h-9 rounded-lg gap-1.5 shrink-0"
                    >
                      Beli Tiket
                      <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
            <div className="text-center">
              <Ticket className="mx-auto size-7 text-muted-foreground/60 mb-2" />
              <p className="font-sans text-xs text-muted-foreground">
                Belum ada jadwal event mendatang.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
