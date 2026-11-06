"use client";

import { MapPin, Search } from "lucide-react";

type HomeHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
};

export function HomeHero({
  search,
  onSearchChange,
  onSearchSubmit,
}: HomeHeroProps) {
  return (
    <section className="bg-muted border-b border-border py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-end">
          <div>
            <h1 className="max-w-2xl font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Temukan event yang
              <br />
              <span className="text-primary">layak dihadiri</span>.
            </h1>

            <p className="mt-4 max-w-lg font-sans text-sm leading-6 text-muted-foreground">
              Konser, festival, olahraga, dan pengalaman menarik yang sedang
              berlangsung di sekitarmu.
            </p>
          </div>

          <div>
            <div className="mb-2.5 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              Jakarta, Indonesia
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSearchSubmit();
              }}
              className="flex h-12 rounded-lg border border-border bg-white shadow-sm overflow-hidden"
            >
              <div className="flex min-w-0 flex-1 items-center px-3.5">
                <Search className="mr-2.5 size-4 shrink-0 text-muted-foreground" />

                <input
                  value={search}
                  onChange={(event) =>
                    onSearchChange(event.target.value)
                  }
                  placeholder="Cari event, artis, venue..."
                  className="w-full bg-transparent font-sans text-sm outline-none placeholder:text-muted-foreground text-foreground"
                />
              </div>

              <button
                type="submit"
                className="flex px-4 shrink-0 items-center justify-center bg-primary text-white font-sans text-sm font-medium hover:bg-primary/90 transition-colors"
                aria-label="Cari event"
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
