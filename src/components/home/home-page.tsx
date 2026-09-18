"use client";

import { useEffect, useMemo, useState } from "react";

import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeHero } from "@/components/home/home-hero";
import { EventCategories } from "@/components/home/event-categories";
import { FeaturedEvents } from "@/components/home/featured-events";
import { PopularEvents } from "@/components/home/popular-events";
import { HomeFooter } from "@/components/home/home-footer";
import { API_URL } from "../../../api";

interface BackendTicketType {
  id: string;
  eventId: string;
  name: string;
  price: string;
  quota: number;
  availableQuota: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendEvent {
  id: string;
  organizerId: string;
  categoryId: string;
  title: string;
  description: string;
  location: string;
  coverImageUrl: string;
  coverImageId: string;
  venueImageUrl: string | null;
  venueImageId: string | null;
  startDatetime: string;
  endDatetime: string;
  isRefundable: boolean;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  category: BackendCategory;
  ticketTypes: BackendTicketType[];
}

export type Event = {
  id: string;
  title: string;
  artist: string;
  category: string;
  location: string;
  date: string;
  day: string;
  month: string;
  price: number;
  image: string;
  available: number;
};

function mapBackendEvent(raw: BackendEvent): Event {
  const dt = new Date(raw.startDatetime);
  const validDate = !isNaN(dt.getTime());

  const prices = raw.ticketTypes.map((t) => Number(t.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const totalAvailable = raw.ticketTypes.reduce(
    (sum, t) => sum + t.availableQuota,
    0,
  );

  return {
    id: raw.id,
    title: raw.title,
    artist: "",
    category: raw.category?.name || "General",
    location: raw.location,
    date: validDate
      ? dt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    day: validDate
      ? String(dt.getDate()).padStart(2, "0")
      : "--",
    month: validDate
      ? dt
          .toLocaleDateString("en-US", { month: "short" })
          .toUpperCase()
      : "---",
    price: minPrice,
    image: raw.coverImageUrl || "/images/hero.jpg",
    available: totalAvailable,
  };
}

export function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, popularRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/events`, { cache: "no-store" }),
          fetch(`${API_URL}/events/most-popular`, { cache: "no-store" }),
          fetch(`${API_URL}/categories`, { cache: "no-store" }),
        ]);

        if (eventsRes.ok) {
          const data: BackendEvent[] = await eventsRes.json();
          setEvents(data.map(mapBackendEvent));
        }

        if (popularRes.ok) {
          const data: BackendEvent[] = await popularRes.json();
          setPopularEvents(data.map(mapBackendEvent));
        }

        if (categoriesRes.ok) {
          const data: BackendCategory[] = await categoriesRes.json();
          setCategories(["All", ...data.map((c) => c.name)]);
        }
      } catch {
        // silently handle network errors; empty state shown
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        category === "All" ||
        event.category.toLowerCase() === category.toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        event.title.toLowerCase().includes(query) ||
        event.artist.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category, events]);

  const filteredPopularEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return popularEvents.filter((event) => {
      const matchesCategory =
        category === "All" ||
        event.category.toLowerCase() === category.toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        event.title.toLowerCase().includes(query) ||
        event.artist.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category, popularEvents]);

  return (
    <div className="min-h-svh bg-background">
      <HomeNavbar />

      <main>
        <HomeHero
          search={search}
          onSearchChange={setSearch}
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
            <FeaturedEvents
              events={filteredEvents.slice(0, 3)}
            />

            <PopularEvents events={filteredPopularEvents} />
          </>
        )}
      </main>

      <HomeFooter />
    </div>
  );
}