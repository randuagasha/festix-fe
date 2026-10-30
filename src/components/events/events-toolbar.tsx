"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EventFilters } from "@/components/events/events-filter-sidebar";

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "date-asc";

type EventsToolbarProps = {
  totalCount: number;
  filters: EventFilters;
  search: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onRemoveCategory: (category: string) => void;
  onRemovePriceType: () => void;
  onRemovePriceRange: () => void;
  onRemoveDateRange: () => void;
  onRemoveSearch: () => void;
  onOpenMobileFilters: () => void;
};

export function EventsToolbar({
  totalCount,
  filters,
  search,
  sortBy,
  onSortChange,
  onRemoveCategory,
  onRemovePriceType,
  onRemovePriceRange,
  onRemoveDateRange,
  onRemoveSearch,
  onOpenMobileFilters,
}: EventsToolbarProps) {
  const activeFilterCount =
    filters.categories.length +
    (filters.priceType !== "all" ? 1 : 0) +
    (filters.minPrice !== "" || filters.maxPrice !== "" ? 1 : 0) +
    (filters.dateRange !== undefined ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const dateLabel =
    filters.dateRange?.from && filters.dateRange?.to
      ? `${filters.dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${filters.dateRange.to.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
      : filters.dateRange?.from
        ? filters.dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold">Explore Events</h2>
          <p className="font-sans text-xs text-muted-foreground">
            {totalCount} {totalCount === 1 ? "event" : "events"} found
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-sans text-xs font-medium md:hidden"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden font-sans text-xs text-muted-foreground sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-9 rounded-lg border bg-background px-3 font-sans text-xs font-medium outline-none focus:border-primary"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="date-asc">Date: Soonest First</option>
            </select>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t pt-3">
          <span className="font-sans text-xs text-muted-foreground">
            Active:
          </span>

          {search.trim() && (
            <Badge
              variant="secondary"
              className="gap-1 font-sans text-xs"
            >
              &ldquo;{search.trim()}&rdquo;
              <button
                type="button"
                onClick={onRemoveSearch}
                aria-label="Remove search"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {filters.categories.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="gap-1 font-sans text-xs"
            >
              {cat}
              <button
                type="button"
                onClick={() => onRemoveCategory(cat)}
                aria-label={`Remove ${cat}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}

          {filters.priceType !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 font-sans text-xs"
            >
              {filters.priceType === "free" ? "Free" : "Paid"}
              <button
                type="button"
                onClick={onRemovePriceType}
                aria-label="Remove price type"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {(filters.minPrice !== "" || filters.maxPrice !== "") && (
            <Badge
              variant="secondary"
              className="gap-1 font-sans text-xs"
            >
              Rp {filters.minPrice || "0"} – {filters.maxPrice || "∞"}
              <button
                type="button"
                onClick={onRemovePriceRange}
                aria-label="Remove price range"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {dateLabel && (
            <Badge
              variant="secondary"
              className="gap-1 font-sans text-xs"
            >
              {dateLabel}
              <button
                type="button"
                onClick={onRemoveDateRange}
                aria-label="Remove date range"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
