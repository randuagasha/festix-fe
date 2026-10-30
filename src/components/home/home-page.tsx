"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeHero } from "@/components/home/home-hero";
import { EventCategories } from "@/components/home/event-categories";
import { FeaturedEvents } from "@/components/home/featured-events";
import { PopularEvents } from "@/components/home/popular-events";
import { HomeFooter } from "@/components/home/home-footer";
import { API_URL } from "../../../api";
import {
  type BackendEvent,
  type Event,
  mapBackendEvent,
} from "@/lib/event-types";

export type { Event };

export function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const categories = ["All", "Hajatan", "Konser", "Pameran", "Seminar", "Workshop"];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, popularRes] = await Promise.all([
          fetch(`${API_URL}/events`, { cache: "no-store" }),
          fetch(`${API_URL}/events/most-popular`, { cache: "no-store" }),
        ]);

        if (eventsRes.ok) {
          const data: BackendEvent[] = await eventsRes.json();
          setEvents(data.map(mapBackendEvent));
        }

        if (popularRes.ok) {
          const data: BackendEvent[] = await popularRes.json();
          setPopularEvents(data.map(mapBackendEvent));
        }

      } catch {
        // silently handle network errors; empty state shown
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const visibleEvents = useMemo(() => {
    const now = new Date();

    return events
      .filter(
        (event) =>
          event.status === "PUBLISHED" && new Date(event.endDatetime) > now,
      )
      .sort(
        (first, second) =>
          new Date(first.startDatetime).getTime() -
          new Date(second.startDatetime).getTime(),
      );
  }, [events]);

  const upcomingEvents = visibleEvents.slice(0, 3);

  const popularEventsWithoutUpcoming = useMemo(() => {
    const upcomingIds = new Set(upcomingEvents.map((event) => event.id));
    const visiblePopularEvents = popularEvents.filter(
      (event) =>
        event.status === "PUBLISHED" && new Date(event.endDatetime) > new Date(),
    );
    const withoutUpcoming = visiblePopularEvents.filter(
      (event) => !upcomingIds.has(event.id),
    );

    return withoutUpcoming.length > 0 ? withoutUpcoming : visiblePopularEvents;
  }, [popularEvents, upcomingEvents]);

  function goToEvents(params: Record<string, string> = {}) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    router.push(query ? `/customers/events?${query}` : "/customers/events");
  }

  function handleSearchSubmit() {
    const query = search.trim();
    goToEvents(query ? { search: query } : {});
  }

  function handleCategorySelect(selectedCategory: string) {
    goToEvents(selectedCategory === "All" ? {} : { category: selectedCategory });
  }

  return (
    <div className="min-h-svh bg-background">
      <HomeNavbar />

      <main>
        <HomeHero
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
        />

        <EventCategories categories={categories} onSelect={handleCategorySelect} />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        ) : (
          <>
            <FeaturedEvents events={upcomingEvents} />

            <PopularEvents events={popularEventsWithoutUpcoming} />
          </>
        )}
      </main>

      <HomeFooter />
    </div>
  );
}