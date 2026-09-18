"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";

import type { Event } from "@/components/home/home-page";

type PopularEventRowProps = {
  event: Event;
};

export function PopularEventRow({
  event,
}: PopularEventRowProps) {
  const [liked, setLiked] = useState(false);

  const price = new Intl.NumberFormat("id-ID").format(event.price);

  return (
    <article className="group grid grid-cols-[64px_88px_1fr_auto] items-center gap-4 border-b py-5 sm:grid-cols-[72px_120px_1fr_auto] sm:gap-6">
      <div className="text-center">
        <p className="font-heading text-xl font-bold">
          {event.day}
        </p>

        <p className="mt-0.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-primary">
          {event.month}
        </p>
      </div>

      <Link
        href={`/events/${event.id}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 88px, 120px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="min-w-0">
        <Link href={`/events/${event.id}`}>
          <h3 className="truncate font-heading text-base font-bold group-hover:text-primary sm:text-lg">
            {event.title}
          </h3>
        </Link>

        <p className="mt-0.5 truncate font-sans text-sm text-muted-foreground">
          {event.artist}
        </p>

        <div className="mt-2 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
          <MapPin className="size-3.5" />

          <span className="truncate">
            {event.location}
          </span>
        </div>
      </div>

      <div className="hidden items-end gap-5 sm:flex">
        <div className="text-right">
          <p className="font-sans text-sm font-semibold">
            Rp {price}
          </p>

          <p className="mt-1 font-sans text-xs text-muted-foreground">
            {event.available} tickets left
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLiked((prev) => !prev)}
          aria-label={
            liked ? "Remove from wishlist" : "Add to wishlist"
          }
          className="flex size-9 items-center justify-center border"
        >
          <Heart
            className={`size-4 ${
              liked
                ? "fill-primary text-primary"
                : "text-foreground"
            }`}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setLiked((prev) => !prev)}
        aria-label={
          liked ? "Remove from wishlist" : "Add to wishlist"
        }
        className="flex size-9 items-center justify-center border sm:hidden"
      >
        <Heart
          className={`size-4 ${
            liked
              ? "fill-primary text-primary"
              : "text-foreground"
          }`}
        />
      </button>
    </article>
  );
}