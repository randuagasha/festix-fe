"use client";

import { MapPin, Search, SlidersHorizontal } from "lucide-react";

type HomeHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function HomeHero({
  search,
  onSearchChange,
}: HomeHeroProps) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-14 lg:px-8 lg:pb-14 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-5 font-sans text-sm font-medium text-primary">
              Discover events
            </p>

            <h1 className="max-w-3xl font-heading text-4xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Find something worth
              <br />
              showing up for.
            </h1>

            <p className="mt-6 max-w-xl font-sans text-base leading-7 text-muted-foreground">
              Concerts, festivals, sports, and experiences happening
              around you.
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 font-sans text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              Jakarta, Indonesia
            </div>

            <div className="flex h-14 border bg-background">
              <div className="flex min-w-0 flex-1 items-center px-4">
                <Search className="mr-3 size-5 shrink-0 text-muted-foreground" />

                <input
                  value={search}
                  onChange={(event) =>
                    onSearchChange(event.target.value)
                  }
                  placeholder="Search events..."
                  className="w-full bg-transparent font-sans text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <button
                type="button"
                className="flex w-14 shrink-0 items-center justify-center border-l transition-colors hover:bg-muted"
                aria-label="Filter events"
              >
                <SlidersHorizontal className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}