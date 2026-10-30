"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/lib/event-types";

type EventDiscoverCardProps = {
  event: Event;
};

export function EventDiscoverCard({ event }: EventDiscoverCardProps) {
  const [liked, setLiked] = useState(false);

  const price = new Intl.NumberFormat("id-ID").format(event.price);

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={`/events/${event.id}`} className="absolute inset-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <Badge
          variant="secondary"
          className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur-sm"
        >
          {event.category}
        </Badge>

        <button
          type="button"
          onClick={() => setLiked((prev) => !prev)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm transition-transform hover:scale-105"
        >
          <Heart
            className={`size-4 ${
              liked ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex flex-col items-center border-r pr-3">
            <span className="font-heading text-lg font-bold leading-none">
              {event.day}
            </span>
            <span className="mt-0.5 font-sans text-[10px] font-semibold tracking-wider text-primary">
              {event.month}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <Link href={`/events/${event.id}`}>
              <h3 className="truncate font-heading text-sm font-bold transition-colors group-hover:text-primary">
                {event.title}
              </h3>
            </Link>

            <div className="mt-1 flex items-center gap-1 font-sans text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <p className="font-sans text-sm font-semibold">
            {event.price === 0 ? "Free" : `Rp ${price}`}
          </p>
          {event.available > 0 && (
            <p className="font-sans text-xs text-muted-foreground">
              {event.available} tickets left
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
