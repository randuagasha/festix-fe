"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import {
  EventsFilterSidebar,
  type EventFilters,
  type PriceType,
} from "@/components/events/events-filter-sidebar";
import {
  EventsToolbar,
  type SortOption,
} from "@/components/events/events-toolbar";
import { EventsGrid } from "@/components/events/events-grid";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { API_URL } from "../../../api";
import {
  type BackendEvent,
  type Event,
  mapBackendEvent,
} from "@/lib/event-types";

const INITIAL_FILTERS: EventFilters = {
  categories: [],
  priceType: "all",
  minPrice: "",
  maxPrice: "",
  dateRange: undefined,
};

function parseFiltersFromParams(searchParams: URLSearchParams): EventFilters {
  const queryCategory = searchParams.get("category");
  const queryCategories = searchParams.getAll("category");
  const queryPriceType = searchParams.get("priceType") as PriceType | null;
  const queryMinPrice = searchParams.get("minPrice") || "";
  const queryMaxPrice = searchParams.get("maxPrice") || "";
  const queryFrom = searchParams.get("from");
  const queryTo = searchParams.get("to");

  const cats: string[] = [];
  if (queryCategories.length > 0) {
    cats.push(...queryCategories);
  } else if (queryCategory && queryCategory !== "All") {
    cats.push(queryCategory);
  }

  return {
    categories: cats,
    priceType: queryPriceType || "all",
    minPrice: queryMinPrice,
    maxPrice: queryMaxPrice,
    dateRange: queryFrom
      ? {
          from: new Date(queryFrom),
          to: queryTo ? new Date(queryTo) : undefined,
        }
      : undefined,
  };
}

export function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [filters, setFilters] = useState<EventFilters>(() =>
    parseFiltersFromParams(new URLSearchParams(searchParams.toString())),
  );
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch(`${API_URL}/events`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data: BackendEvent[] = await res.json();
        if (active) {
          setAllEvents(data.map(mapBackendEvent));
          setIsLoading(false);
        }
      } catch {
        if (active) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function fetchEvents() {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch(`${API_URL}/events`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data: BackendEvent[] = await res.json();
      setAllEvents(data.map(mapBackendEvent));
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  // Sync URL search params
  function updateUrl(newSearch: string, newFilters: EventFilters) {
    const params = new URLSearchParams();

    if (newSearch.trim()) params.set("search", newSearch.trim());
    newFilters.categories.forEach((cat) => params.append("category", cat));
    if (newFilters.priceType !== "all") params.set("priceType", newFilters.priceType);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.dateRange?.from) {
      params.set("from", newFilters.dateRange.from.toISOString().split("T")[0]);
    }
    if (newFilters.dateRange?.to) {
      params.set("to", newFilters.dateRange.to.toISOString().split("T")[0]);
    }

    const qs = params.toString();
    router.replace(qs ? `/customers/events?${qs}` : "/customers/events", {
      scroll: false,
    });
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    updateUrl(value, filters);
  }

  function handleFiltersChange(newFilters: EventFilters) {
    setFilters(newFilters);
    updateUrl(search, newFilters);
  }

  function handleClearAll() {
    setFilters(INITIAL_FILTERS);
    setSearch("");
    router.replace("/customers/events", { scroll: false });
  }

  // Filter pipeline
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const query = search.trim().toLowerCase();

    return allEvents
      .filter((event) => {
        // Visibility: PUBLISHED + not expired
        if (event.status !== "PUBLISHED") return false;
        if (new Date(event.endDatetime) <= now) return false;

        // Search: title, location
        if (query) {
          const matchTitle = event.title.toLowerCase().includes(query);
          const matchLocation = event.location.toLowerCase().includes(query);
          if (!matchTitle && !matchLocation) return false;
        }

        // Category: OR logic (any selected matches)
        if (filters.categories.length > 0) {
          const matchCat = filters.categories.some(
            (c) => c.toLowerCase() === event.category.toLowerCase(),
          );
          if (!matchCat) return false;
        }

        // Price type
        if (filters.priceType === "free" && event.price > 0) return false;
        if (filters.priceType === "paid" && event.price === 0) return false;

        // Price range
        const min = filters.minPrice ? Number(filters.minPrice) : null;
        const max = filters.maxPrice ? Number(filters.maxPrice) : null;
        if (min !== null && !isNaN(min) && event.price < min) return false;
        if (max !== null && !isNaN(max) && event.price > max) return false;

        // Date range
        if (filters.dateRange?.from) {
          const eventStart = new Date(event.startDatetime);
          const from = new Date(filters.dateRange.from);
          from.setHours(0, 0, 0, 0);

          if (filters.dateRange.to) {
            const to = new Date(filters.dateRange.to);
            to.setHours(23, 59, 59, 999);
            if (eventStart < from || eventStart > to) return false;
          } else {
            const to = new Date(from);
            to.setHours(23, 59, 59, 999);
            if (eventStart < from || eventStart > to) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "date-asc":
            return (
              new Date(a.startDatetime).getTime() -
              new Date(b.startDatetime).getTime()
            );
          case "recommended":
          default:
            return 0;
        }
      });
  }, [allEvents, search, filters, sortBy]);

  return (
    <div className="min-h-svh bg-background">
      <HomeNavbar />

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 border-b pb-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">
            Explore Tixora
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Find your next experience.
          </h1>
          <p className="mt-2 max-w-2xl font-sans text-sm text-muted-foreground">
            Discover events, explore new interests, and find something worth showing up for.
          </p>

          <div className="mt-6 flex max-w-xl items-center rounded-xl border bg-card px-3 shadow-xs">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search events, artists, venues..."
              className="h-11 w-full bg-transparent px-3 font-sans text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Discovery Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr]">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden h-fit rounded-2xl border bg-card p-5 md:block">
            <EventsFilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={handleClearAll}
            />
          </aside>

          {/* Results Area */}
          <div className="space-y-6">
            <EventsToolbar
              totalCount={filteredEvents.length}
              filters={filters}
              search={search}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onRemoveCategory={(cat) =>
                handleFiltersChange({
                  ...filters,
                  categories: filters.categories.filter((c) => c !== cat),
                })
              }
              onRemovePriceType={() =>
                handleFiltersChange({ ...filters, priceType: "all" })
              }
              onRemovePriceRange={() =>
                handleFiltersChange({ ...filters, minPrice: "", maxPrice: "" })
              }
              onRemoveDateRange={() =>
                handleFiltersChange({ ...filters, dateRange: undefined })
              }
              onRemoveSearch={() => handleSearchChange("")}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            <EventsGrid
              events={filteredEvents}
              isLoading={isLoading}
              isError={isError}
              onRetry={fetchEvents}
              onClearFilters={handleClearAll}
            />
          </div>
        </div>
      </main>

      {/* Mobile Filter Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[300px] overflow-y-auto p-6 sm:w-[350px]">
          <SheetHeader className="p-0 pb-4">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <EventsFilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearAll={handleClearAll}
          />
        </SheetContent>
      </Sheet>

      <HomeFooter />
    </div>
  );
}
