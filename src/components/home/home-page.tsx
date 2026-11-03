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
  const [category, setCategory] = useState("All");
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

  const categoryFilteredEvents = useMemo(() => {
    return visibleEvents.filter(
      (event) =>
        category === "All" ||
        event.category.toLowerCase() === category.toLowerCase(),
    );
  }, [visibleEvents, category]);

  const upcomingEvents = categoryFilteredEvents.slice(0, 3);

  const popularEventsWithoutUpcoming = useMemo(() => {
    const upcomingIds = new Set(upcomingEvents.map((event) => event.id));
    const now = new Date();
    const visiblePopularEvents = popularEvents
      .filter(
        (event) =>
          event.status === "PUBLISHED" && new Date(event.endDatetime) > now,
      )
      .filter(
        (event) =>
          category === "All" ||
          event.category.toLowerCase() === category.toLowerCase(),
      );
    const withoutUpcoming = visiblePopularEvents.filter(
      (event) => !upcomingIds.has(event.id),
    );

    return withoutUpcoming.length > 0 ? withoutUpcoming : visiblePopularEvents;
  }, [popularEvents, upcomingEvents, category]);

  function goToEvents(params: Record<string, string> = {}) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    router.push(query ? `/customers/events?${query}` : "/customers/events");
  }

  function handleSearchSubmit() {
    const query = search.trim();
    goToEvents(query ? { search: query } : {});
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

        <EventCategories
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

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