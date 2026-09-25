"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { EventStatusEntry, EventCategoryEntry } from "./dashboard-types";
import {
  formatEventStatus,
  getEventStatusVariant,
  formatNumber,
} from "./dashboard-formatters";
import { Badge } from "@/components/ui/badge";

const categoryChartConfig: ChartConfig = {
  count: {
    label: "Events",
    color: "var(--color-chart-1)",
  },
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
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Event Status Distribution */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Event Status</CardTitle>
          <CardDescription>Current status across all events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {byStatus.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No event status records.
            </p>
          ) : (
            <div className="space-y-3">
              {byStatus.map((item) => {
                const pct = totalStatusEvents > 0
                  ? Math.round((item.count / totalStatusEvents) * 100)
                  : 0;

                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={getEventStatusVariant(item.status)}>
                          {formatEventStatus(item.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">
                          {formatNumber(item.count)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Events by Category */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
          <CardDescription>Distribution of events by category</CardDescription>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-muted-foreground">No category records.</p>
            </div>
          ) : (
            <ChartContainer config={categoryChartConfig} className="h-64 w-full">
              <BarChart
                data={topCategories}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
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
                  fill="var(--color-chart-1)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
