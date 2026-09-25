import {
  Users,
  CalendarDays,
  ShoppingCart,
  Banknote,
  Ticket,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardSummary } from "./dashboard-types";
import { formatNumber, formatCompactIDR } from "./dashboard-formatters";

type StatCard = {
  label: string;
  value: string;
  icon: React.ElementType;
};

function buildStats(
  summary: DashboardSummary,
  totalRevenue: number
): StatCard[] {
  return [
    {
      label: "Total Users",
      value: formatNumber(summary.totalUsers),
      icon: Users,
    },
    {
      label: "Total Events",
      value: formatNumber(summary.totalEvents),
      icon: CalendarDays,
    },
    {
      label: "Published Events",
      value: formatNumber(summary.publishedEvents),
      icon: CheckCircle,
    },
    {
      label: "Total Orders",
      value: formatNumber(summary.totalOrders),
      icon: ShoppingCart,
    },
    {
      label: "Revenue",
      value: formatCompactIDR(totalRevenue),
      icon: Banknote,
    },
    {
      label: "Issued Tickets",
      value: formatNumber(summary.totalIssuedTickets),
      icon: Ticket,
    },
  ];
}

export function DashboardSummaryCards({
  summary,
  totalRevenue,
}: {
  summary: DashboardSummary;
  totalRevenue: number;
}) {
  const stats = buildStats(summary, totalRevenue);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="rounded-2xl">
            <CardContent className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xl font-bold tabular-nums">
                  {stat.value}
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
