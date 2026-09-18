"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Ticket } from "lucide-react";

import type { Event } from "@/components/home/home-page";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/90 px-3 py-1.5 font-sans text-xs font-semibold text-foreground backdrop-blur-md">
            {event.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setLiked((prev) => !prev)}
          aria-label={
            liked ? "Remove from wishlist" : "Add to wishlist"
          }
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur-md transition-transform hover:scale-105"
        >
          <Heart
            className={`size-5 ${
              liked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-sans text-xs font-medium text-white/70">
            {event.date}
          </p>

          <h3 className="mt-1 font-heading text-xl font-bold leading-tight text-white">
            {event.title}
          </h3>

          <p className="mt-1 font-sans text-sm text-white/80">
            {event.artist}
          </p>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Ticket className="size-4 text-primary" />

            <span className="font-sans text-sm font-semibold">
              Rp {new Intl.NumberFormat("id-ID").format(event.price)}
            </span>
          </div>

          <span className="font-sans text-xs text-muted-foreground">
            {event.available} tickets left
          </span>
        </div>
      </div>
    </article>
  );
}