"use client";

import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

const CATEGORIES = ["Hajatan", "Konser", "Pameran", "Seminar", "Workshop"];

export type PriceType = "all" | "free" | "paid";

export type EventFilters = {
  categories: string[];
  priceType: PriceType;
  minPrice: string;
  maxPrice: string;
  dateRange: DateRange | undefined;
};

type EventsFilterSidebarProps = {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  onClearAll: () => void;
};

function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getPresetRange(preset: string): DateRange {
  const today = getStartOfDay(new Date());
  const dayOfWeek = today.getDay();

  switch (preset) {
    case "today":
      return { from: today, to: getEndOfDay(today) };
    case "weekend": {
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + ((6 - dayOfWeek + 7) % 7 || 7));
      if (dayOfWeek === 6) saturday.setDate(today.getDate());
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      return { from: getStartOfDay(saturday), to: getEndOfDay(sunday) };
    }
    case "this-week": {
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
      const sundayEnd = new Date(monday);
      sundayEnd.setDate(monday.getDate() + 6);
      return { from: getStartOfDay(monday), to: getEndOfDay(sundayEnd) };
    }
    case "next-week": {
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + (7 - ((dayOfWeek + 6) % 7)));
      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6);
      return { from: getStartOfDay(nextMonday), to: getEndOfDay(nextSunday) };
    }
    default:
      return { from: today, to: getEndOfDay(today) };
  }
}

export function EventsFilterSidebar({
  filters,
  onFiltersChange,
  onClearAll,
}: EventsFilterSidebarProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  function toggleCategory(category: string) {
    const next = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: next });
  }

  function setPriceType(priceType: PriceType) {
    onFiltersChange({
      ...filters,
      priceType,
      minPrice: priceType === "free" ? "" : filters.minPrice,
      maxPrice: priceType === "free" ? "" : filters.maxPrice,
    });
  }

  function setDateRange(range: DateRange | undefined) {
    onFiltersChange({ ...filters, dateRange: range });
  }

  function applyPreset(preset: string) {
    onFiltersChange({ ...filters, dateRange: getPresetRange(preset) });
    setCalendarOpen(false);
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceType !== "all" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.dateRange !== undefined;

  const dateLabel =
    filters.dateRange?.from && filters.dateRange?.to
      ? `${filters.dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${filters.dateRange.to.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
      : filters.dateRange?.from
        ? filters.dateRange.from.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="font-sans text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <h4 className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </h4>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.categories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <span className="font-sans text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-5">
        <h4 className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Range
        </h4>
        <div className="flex gap-2">
          {(["all", "free", "paid"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPriceType(type)}
              className={`rounded-full border px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                filters.priceType === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {type === "all" ? "All" : type === "free" ? "Free" : "Paid"}
            </button>
          ))}
        </div>

        {filters.priceType === "paid" && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) =>
                  onFiltersChange({ ...filters, minPrice: e.target.value })
                }
                className="h-8 w-full rounded-lg border bg-transparent px-2.5 font-sans text-xs outline-none focus:border-primary"
              />
            </div>
            <span className="font-sans text-xs text-muted-foreground">–</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) =>
                  onFiltersChange({ ...filters, maxPrice: e.target.value })
                }
                className="h-8 w-full rounded-lg border bg-transparent px-2.5 font-sans text-xs outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-5">
        <h4 className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Event Date
        </h4>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {[
            { label: "Today", value: "today" },
            { label: "This Weekend", value: "weekend" },
            { label: "This Week", value: "this-week" },
            { label: "Next Week", value: "next-week" },
          ].map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => applyPreset(preset.value)}
              className="rounded-full border px-2.5 py-1 font-sans text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <div className="flex h-9 w-full items-center justify-between rounded-lg border px-3 transition-colors hover:border-primary">
            <PopoverTrigger className="flex min-w-0 flex-1 items-center gap-2 text-left font-sans text-xs text-muted-foreground">
              <CalendarIcon className="size-3.5 shrink-0" />
              <span className="truncate">{dateLabel || "Pick a date range"}</span>
            </PopoverTrigger>
            {dateLabel && (
              <button
                type="button"
                onClick={() => setDateRange(undefined)}
                className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear date range"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
          <PopoverContent
            align="start"
            className="w-auto p-0"
            side="bottom"
          >
            <Calendar
              mode="range"
              selected={filters.dateRange}
              onSelect={(range) => {
                setDateRange(range);
                if (range?.from && range?.to) {
                  setCalendarOpen(false);
                }
              }}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
            />
            {filters.dateRange && (
              <div className="border-t px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateRange(undefined);
                    setCalendarOpen(false);
                  }}
                  className="w-full font-sans text-xs"
                >
                  Clear dates
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
