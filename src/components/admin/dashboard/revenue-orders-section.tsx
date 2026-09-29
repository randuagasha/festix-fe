"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyOrderEntry } from "./dashboard-types";
import {
  formatShortMonth,
  formatIDR,
  formatCompactIDR,
  formatNumber,
} from "./dashboard-formatters";
import { TrendingUp, ShoppingCart } from "lucide-react";

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-1)",
  },
};

const ordersChartConfig: ChartConfig = {
  orders: {
    label: "Paid Orders",
    color: "var(--color-chart-1)",
  },
};

export function RevenueOrdersSection({
  monthly,
  totalRevenue,
  paidOrders,
}: {
  monthly: MonthlyOrderEntry[];
  totalRevenue: number;
  paidOrders: number;
}) {
  const chartData = monthly.map((item) => ({
    month: formatShortMonth(item.month),
    revenue: item.revenue,
    orders: item.orders,
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <TrendingUp className="size-3.5" />
          </div>
          <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
            Revenue & Order Trends
          </h2>
          <span className="font-sans text-xs text-muted-foreground">
            (Last 6 Months)
          </span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Revenue Trend Chart */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-sans text-xs font-medium text-muted-foreground">
                Total Revenue
              </p>
              <p className="font-heading text-xl font-bold tracking-tight text-foreground tabular-nums">
                {formatCompactIDR(totalRevenue)}
              </p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="size-4" />
            </div>
          </div>

          <ChartContainer config={revenueChartConfig} className="h-52 w-full font-sans">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -5, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
                opacity={0.6}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) => formatCompactIDR(val)}
                width={60}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 10,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatIDR(Number(value))}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#fillRevenueGradient)"
                activeDot={{ r: 4, fill: "var(--primary)" }}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Paid Orders Trend Chart */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-sans text-xs font-medium text-muted-foreground">
                Paid Orders
              </p>
              <p className="font-heading text-xl font-bold tracking-tight text-foreground tabular-nums">
                {formatNumber(paidOrders)}
              </p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingCart className="size-4" />
            </div>
          </div>

          <ChartContainer config={ordersChartConfig} className="h-52 w-full font-sans">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
                opacity={0.6}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 10,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${formatNumber(Number(value))} orders`}
                  />
                }
              />
              <Bar
                dataKey="orders"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
