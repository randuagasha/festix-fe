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
    <article className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

        <div className="absolute left-3.5 top-3.5">
          <span className="rounded-md bg-white/95 px-2.5 py-1 font-sans text-xs font-semibold text-foreground backdrop-blur-sm">
            {event.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setLiked((prev) => !prev)}
          aria-label={
            liked ? "Hapus dari wishlist" : "Tambah ke wishlist"
          }
          className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full bg-white/95 text-foreground backdrop-blur-sm transition-transform hover:scale-105"
        >
          <Heart
            className={`size-4 ${
              liked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        <div className="absolute bottom-3.5 left-3.5 right-3.5">
          <p className="font-sans text-xs font-medium text-white/70">
            {event.date}
          </p>

          <h3 className="mt-1 font-heading text-lg font-bold leading-tight text-white line-clamp-1">
            {event.title}
          </h3>

          {event.artist && (
            <p className="mt-0.5 font-sans text-xs text-white/80 line-clamp-1">
              {event.artist}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        <div className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Ticket className="size-3.5 text-primary" />

            <span className="font-sans text-sm font-semibold text-foreground">
              Rp {new Intl.NumberFormat("id-ID").format(event.price)}
            </span>
          </div>

          <span className="font-sans text-xs text-muted-foreground">
            Sisa {event.available} tiket
          </span>
        </div>
      </div>
    </article>
  );
}
