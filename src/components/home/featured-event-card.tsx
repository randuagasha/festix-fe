"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";

import type { Event } from "@/components/home/home-page";

type FeaturedEventCardProps = {
  event: Event;
};

export function FeaturedEventCard({
  event,
}: FeaturedEventCardProps) {
  const [liked, setLiked] = useState(false);

  const price = new Intl.NumberFormat("id-ID").format(event.price);

  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link
          href={`/events/${event.id}`}
          className="absolute inset-0"
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <button
          type="button"
          onClick={() => setLiked((prev) => !prev)}
          aria-label={
            liked ? "Remove from wishlist" : "Add to wishlist"
          }
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/95 transition-transform hover:scale-105"
        >
          <Heart
            className={`size-[18px] ${
              liked
                ? "fill-primary text-primary"
                : "text-foreground"
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-[54px_1fr] gap-4 border-b py-5">
        <div className="border-r pr-4 text-center">
          <p className="font-heading text-xl font-bold leading-none">
            {event.day}
          </p>

          <p className="mt-1 font-sans text-[10px] font-semibold tracking-wider text-primary">
            {event.month}
          </p>
        </div>

        <div className="min-w-0">
          <Link href={`/events/${event.id}`}>
            <h3 className="truncate font-heading text-lg font-bold transition-colors group-hover:text-primary">
              {event.title}
            </h3>
          </Link>

          <p className="mt-1 truncate font-sans text-sm text-muted-foreground">
            {event.artist}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5 font-sans text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />

              <span className="truncate">
                {event.location}
              </span>
            </div>

            <p className="shrink-0 font-sans text-sm font-semibold">
              Rp {price}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}