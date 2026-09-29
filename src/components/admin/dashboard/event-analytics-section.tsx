"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { EventStatusEntry, EventCategoryEntry } from "./dashboard-types";
import {
  formatEventStatus,
  formatNumber,
} from "./dashboard-formatters";
import {
  CalendarDays,
  Globe,
  FileEdit,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Tag,
  Layers,
} from "lucide-react";

const categoryChartConfig: ChartConfig = {
  count: {
    label: "Events",
    color: "var(--color-chart-1)",
  },
};

const statusIcons: Record<string, React.ElementType> = {
  PUBLISHED: Globe,
  DRAFT: FileEdit,
  PENDING_REVIEW: Clock,
  COMPLETED: CheckCircle2,
  CANCELLED: Ban,
  REJECTED: XCircle,
};

const statusColors: Record<string, string> = {
  PUBLISHED: "text-primary",
  DRAFT: "text-muted-foreground",
  PENDING_REVIEW: "text-amber-500",
  COMPLETED: "text-muted-foreground",
  CANCELLED: "text-destructive",
  REJECTED: "text-destructive",
};

export function EventAnalyticsSection({
  byStatus,
  byCategory,
}: {
  byStatus: EventStatusEntry[];
  byCategory: EventCategoryEntry[];
}) {
  const topCategories = [...byCategory]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const totalStatusEvents = byStatus.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <CalendarDays className="size-3.5" />
        </div>
        <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
          Event Analytics
        </h2>
        <span className="font-sans text-xs text-muted-foreground">
          ({formatNumber(totalStatusEvents)} total events)
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Status Distribution */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" />
              <p className="font-sans text-xs font-semibold text-foreground">
                Status Breakdown
              </p>
            </div>
            <span className="font-sans text-[11px] text-muted-foreground">
              Lifecycle stages
            </span>
          </div>

          {byStatus.length === 0 ? (
            <p className="py-8 text-center font-sans text-xs text-muted-foreground">
              No event data recorded yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {byStatus.map((item) => {
                const pct = totalStatusEvents > 0
                  ? Math.round((item.count / totalStatusEvents) * 100)
                  : 0;
                const Icon = statusIcons[item.status] ?? CalendarDays;
                const color = statusColors[item.status] ?? "text-muted-foreground";

                return (
                  <div key={item.status}>
                    <div className="mb-1 flex items-center justify-between font-sans text-xs">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-3.5 ${color}`} />
                        <span className="font-medium text-foreground">
                          {formatEventStatus(item.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatNumber(item.count)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag className="size-3.5 text-primary" />
              <p className="font-sans text-xs font-semibold text-foreground">
                Top Categories
              </p>
            </div>
            <span className="font-sans text-[11px] text-muted-foreground">
              By event count
            </span>
          </div>

          {topCategories.length === 0 ? (
            <div className="flex h-48 items-center justify-center">
              <p className="font-sans text-xs text-muted-foreground">
                No category data available.
              </p>
            </div>
          ) : (
            <ChartContainer config={categoryChartConfig} className="h-48 w-full font-sans">
              <BarChart
                data={topCategories}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 5, bottom: 0 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  opacity={0.6}
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 10,
                    fontFamily: "var(--font-sans)",
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  tick={{
                    fill: "var(--foreground)",
                    fontSize: 11,
                    fontFamily: "var(--font-sans)",
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${formatNumber(Number(value))} events`}
                    />
                  }
                />
                <Bar
                  dataKey="count"
                  fill="var(--primary)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </div>
    </div>
  );
}
