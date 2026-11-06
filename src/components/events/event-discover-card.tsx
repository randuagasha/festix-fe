"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { Event } from "@/lib/event-types";

type EventDiscoverCardProps = {
  event: Event;
};

export function EventDiscoverCard({ event }: EventDiscoverCardProps) {
  const [liked, setLiked] = useState(false);
  const price = new Intl.NumberFormat("id-ID").format(event.price);

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-md hover:border-primary/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={`/events/${event.id}`} className="absolute inset-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 font-sans text-xs font-semibold text-foreground backdrop-blur-sm">
          {event.category}
        </span>

        <button
          type="button"
          onClick={() => setLiked((prev) => !prev)}
          aria-label={liked ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm transition-transform hover:scale-105"
        >
          <Heart
            className={`size-3.5 ${
              liked ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2.5 flex items-center gap-3">
          <div className="flex flex-col items-center border-r border-border pr-3 shrink-0">
            <span className="font-heading text-lg font-bold leading-none text-foreground">
              {event.day}
            </span>
            <span className="mt-0.5 font-sans text-[10px] font-semibold tracking-wider text-primary">
              {event.month}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <Link href={`/events/${event.id}`}>
              <h3 className="truncate font-heading text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {event.title}
              </h3>
            </Link>

            <div className="mt-0.5 flex items-center gap-1 font-sans text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2.5">
          <p className="font-sans text-sm font-semibold text-foreground">
            {event.price === 0 ? "Gratis" : `Rp ${price}`}
          </p>
          {event.available > 0 && (
            <p className="font-sans text-xs text-muted-foreground">
              Sisa {event.available}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
