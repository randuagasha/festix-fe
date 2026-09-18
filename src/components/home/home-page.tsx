"use client";

import { useMemo, useState } from "react";

import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeHero } from "@/components/home/home-hero";
import { EventCategories } from "@/components/home/event-categories";
import { FeaturedEvents } from "@/components/home/featured-events";
import { PopularEvents } from "@/components/home/popular-events";
import { HomeFooter } from "@/components/home/home-footer";

export type EventCategory =
  | "All"
  | "Music"
  | "Festival"
  | "Sports"
  | "Comedy"
  | "Theater"
  | "Workshop";

export type Event = {
  id: number;
  title: string;
  artist: string;
  category: Exclude<EventCategory, "All">;
  location: string;
  date: string;
  day: string;
  month: string;
  price: number;
  image: string;
  available: number;
};

const events: Event[] = [
  {
    id: 1,
    title: "International Fest 2026",
    artist: "Kendrick Lamar",
    category: "Festival",
    location: "Jakarta, Indonesia",
    date: "20 Nov 2026",
    day: "20",
    month: "NOV",
    price: 1500000,
    available: 125,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 2,
    title: "Live in Bali",
    artist: "Ice Cube",
    category: "Music",
    location: "Bali, Indonesia",
    date: "27 Nov 2026",
    day: "27",
    month: "NOV",
    price: 1200000,
    available: 82,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 3,
    title: "Jakarta Music Week",
    artist: "Various Artists",
    category: "Music",
    location: "Jakarta, Indonesia",
    date: "04 Dec 2026",
    day: "04",
    month: "DEC",
    price: 950000,
    available: 243,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 4,
    title: "Neon Night",
    artist: "Electronic Music Experience",
    category: "Music",
    location: "Bandung, Indonesia",
    date: "12 Dec 2026",
    day: "12",
    month: "DEC",
    price: 750000,
    available: 96,
    image:
      "https://images.unsplash.com/photo-1571266028243-d220c9c3b9f2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 5,
    title: "Champions Arena",
    artist: "Live Sports Experience",
    category: "Sports",
    location: "Jakarta, Indonesia",
    date: "10 Jan 2027",
    day: "10",
    month: "JAN",
    price: 500000,
    available: 310,
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 6,
    title: "Comedy Night",
    artist: "Stand Up Special",
    category: "Comedy",
    location: "Jakarta, Indonesia",
    date: "22 Dec 2026",
    day: "22",
    month: "DEC",
    price: 350000,
    available: 184,
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 7,
    title: "Creative Workshop",
    artist: "Design & Digital Experience",
    category: "Workshop",
    location: "Tangerang, Indonesia",
    date: "15 Jan 2027",
    day: "15",
    month: "JAN",
    price: 275000,
    available: 45,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: 8,
    title: "Broadway Nights",
    artist: "Theater Experience",
    category: "Theater",
    location: "Jakarta, Indonesia",
    date: "22 Jan 2027",
    day: "22",
    month: "JAN",
    price: 650000,
    available: 72,
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=85",
  },
];

export function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<EventCategory>("All");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        category === "All" || event.category === category;

      const matchesSearch =
        query.length === 0 ||
        event.title.toLowerCase().includes(query) ||
        event.artist.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div className="min-h-svh bg-background">
      <HomeNavbar />

      <main>
        <HomeHero
          search={search}
          onSearchChange={setSearch}
        />

        <EventCategories
          selected={category}
          onSelect={setCategory}
        />

        <FeaturedEvents
          events={filteredEvents.slice(0, 3)}
        />

        <PopularEvents events={filteredEvents} />
      </main>

      <HomeFooter />
    </div>
  );
}