"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Search,
  X,
  Ticket,
  ChevronRight,
  Sparkles,
  Calendar,
  ArrowRight,
} from "lucide-react";
import type { Event } from "@/lib/event-types";

type HomeHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
  events?: Event[];
};

function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function HomeHero({
  search,
  onSearchChange,
  events = [],
}: HomeHeroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Real-time matching events based on search query
  const matchingEvents = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];
    return events.filter((e) => {
      return (
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        (e.artist && e.artist.toLowerCase().includes(q))
      );
    });
  }, [events, search]);

  // Fallback suggestions when search is empty but focused
  const popularSuggestions = useMemo(() => {
    return events.slice(0, 3);
  }, [events]);

  const displayedEvents = search.trim() ? matchingEvents.slice(0, 5) : popularSuggestions;
  const isSearchActive = search.trim().length > 0;

  return (
    <section className="bg-muted border-b border-border py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
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

          {/* Search Bar Container with Dropdown */}
          <div ref={containerRef} className="relative">
            <div className="mb-2.5 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              Jakarta, Indonesia
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setIsOpen(true);
              }}
              className="relative flex h-12 rounded-xl border border-border bg-white shadow-xs overflow-hidden transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15"
            >
              <div className="flex min-w-0 flex-1 items-center px-3.5">
                <Search className="mr-2.5 size-4 shrink-0 text-muted-foreground" />

                <input
                  ref={inputRef}
                  value={search}
                  onFocus={() => setIsOpen(true)}
                  onChange={(event) => {
                    onSearchChange(event.target.value);
                    setIsOpen(true);
                  }}
                  placeholder="Cari event, artis, venue..."
                  className="w-full bg-transparent font-sans text-sm outline-none placeholder:text-muted-foreground text-foreground"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange("");
                      inputRef.current?.focus();
                    }}
                    className="mr-1.5 size-5 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
                    title="Hapus pencarian"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="flex px-5 shrink-0 items-center justify-center bg-primary text-white font-sans text-sm font-semibold hover:bg-primary/90 transition-colors"
                aria-label="Cari event"
              >
                Cari
              </button>
            </form>

            {/* MODERN SEARCH DROPDOWN CARDS */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border/80 bg-white shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                {/* Header label inside dropdown */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/50">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    {isSearchActive ? (
                      <>
                        <Search className="size-3 text-primary" />
                        Hasil Pencarian ({matchingEvents.length})
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-3 text-primary" />
                        Rekomendasi Event
                      </>
                    )}
                  </span>
                  {isSearchActive && (
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      className="font-sans text-[11px] text-primary hover:underline font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Event Cards List */}
                <div className="max-h-[380px] overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
                  {isSearchActive && matchingEvents.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <Search className="size-7 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="font-heading text-sm font-bold text-foreground">
                        Tidak Ada Event Ditemukan
                      </p>
                      <p className="font-sans text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                        Tidak menemukan hasil untuk &quot;{search}&quot;. Coba gunakan kata kunci artis, kategori, atau lokasi lain.
                      </p>
                    </div>
                  ) : (
                    displayedEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl transition-all duration-150 hover:bg-secondary/40 border border-transparent hover:border-border/60"
                      >
                        {/* Event Thumbnail */}
                        {event.image ? (
                          <div className="relative size-14 sm:size-16 rounded-xl overflow-hidden shrink-0 border border-border/50 bg-muted">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex size-14 sm:size-16 rounded-xl bg-primary/10 items-center justify-center shrink-0 border border-primary/20 text-primary">
                            <Ticket className="size-6" />
                          </div>
                        )}

                        {/* Event Information */}
                        <div className="flex flex-col min-w-0 flex-1 justify-center">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                              {event.category}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate">
                              {event.date}
                            </span>
                          </div>

                          <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {event.title}
                          </h4>

                          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground gap-2">
                            <span className="truncate flex items-center gap-1 text-[11px]">
                              <MapPin className="size-3 text-primary shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </span>
                            <span className="font-heading text-xs font-bold text-primary shrink-0">
                              {formatIDR(event.price)}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-0.5" />
                      </Link>
                    ))
                  )}
                </div>

                {/* Footer Link if more results exist */}
                {isSearchActive && matchingEvents.length > 5 && (
                  <div className="border-t border-border/60 bg-secondary/20 p-2.5 px-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-sans">
                      Menampilkan 5 dari {matchingEvents.length} event
                    </span>
                    <Link
                      href={`/customers/events?search=${encodeURIComponent(search.trim())}`}
                      onClick={() => setIsOpen(false)}
                      className="font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      Lihat Semua
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
