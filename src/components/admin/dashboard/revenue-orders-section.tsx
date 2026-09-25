"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import type { MonthlyOrderEntry, OrderStatusEntry } from "./dashboard-types";
import {
  formatMonth,
  formatShortMonth,
  formatIDR,
  formatCompactIDR,
  formatNumber,
  formatPaymentStatus,
  getPaymentStatusVariant,
} from "./dashboard-formatters";
import { Badge } from "@/components/ui/badge";

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-1)",
  },
};

const ordersChartConfig: ChartConfig = {
  orders: {
    label: "Paid Orders",
    color: "var(--color-chart-2)",
  },
};

export function RevenueOrdersSection({
  monthly,
  byStatus,
}: {
  monthly: MonthlyOrderEntry[];
  byStatus: OrderStatusEntry[];
}) {
  const chartData = monthly.map((item) => ({
    month: formatShortMonth(item.month),
    fullMonth: formatMonth(item.month),
    revenue: item.revenue,
    orders: item.orders,
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-64 w-full">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val: number) => formatCompactIDR(val)}
                  width={60}
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
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#fillRevenue)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Orders Trend */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Paid Orders Trend</CardTitle>
            <CardDescription>Monthly order volume over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ordersChartConfig} className="h-64 w-full">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={40} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${formatNumber(Number(value))} orders`}
                    />
                  }
                />
                <Bar
                  dataKey="orders"
                  fill="var(--color-chart-2)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status Breakdown */}
      <Card className="rounded-2xl">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <span className="font-heading text-sm font-semibold">Payment Status</span>
          <div className="flex flex-wrap items-center gap-3">
            {byStatus.length === 0 ? (
              <span className="text-xs text-muted-foreground">No payment records</span>
            ) : (
              byStatus.map((item) => (
                <div key={item.status} className="flex items-center gap-2 text-sm">
                  <Badge variant={getPaymentStatusVariant(item.status)}>
                    {formatPaymentStatus(item.status)}
                  </Badge>
                  <span className="font-mono font-medium">{formatNumber(item.count)}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
