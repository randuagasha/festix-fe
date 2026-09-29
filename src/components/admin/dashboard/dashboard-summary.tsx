import {
  Users,
  CalendarDays,
  ShoppingCart,
  Banknote,
  Ticket,
  Check,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardSummary } from "./dashboard-types";
import { formatNumber, formatCompactIDR } from "./dashboard-formatters";

type StatCard = {
  label: string;
  value: string;
  subLabel: string;
  subValue: string;
  icon: React.ElementType;
  subIcon: React.ElementType;
  isPrimary?: boolean;
};

function buildStats(
  summary: DashboardSummary,
  totalRevenue: number
): StatCard[] {
  return [
    {
      label: "Total Users",
      value: formatNumber(summary.totalUsers),
      subLabel: "Organizers",
      subValue: formatNumber(summary.totalOrganizers),
      icon: Users,
      subIcon: Building2,
    },
    {
      label: "Total Events",
      value: formatNumber(summary.totalEvents),
      subLabel: "Published",
      subValue: formatNumber(summary.publishedEvents),
      icon: CalendarDays,
      subIcon: Check,
    },
    {
      label: "Total Orders",
      value: formatNumber(summary.totalOrders),
      subLabel: "Paid",
      subValue: formatNumber(summary.paidOrders),
      icon: ShoppingCart,
      subIcon: Check,
    },
    {
      label: "Total Revenue",
      value: formatCompactIDR(totalRevenue),
      subLabel: "Paid orders",
      subValue: formatNumber(summary.paidOrders),
      icon: Banknote,
      subIcon: Check,
      isPrimary: true,
    },
    {
      label: "Tickets Issued",
      value: formatNumber(summary.totalIssuedTickets),
      subLabel: "Redeemed",
      subValue: formatNumber(summary.totalRedeemedTickets),
      icon: Ticket,
      subIcon: Check,
      isPrimary: true,
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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const SubIcon = stat.subIcon;

        return (
          <div
            key={stat.label}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
              stat.isPrimary
                ? "border-primary/30 bg-card ring-1 ring-primary/10"
                : "border-border/80 bg-card ring-1 ring-foreground/5"
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
                    stat.isPrimary
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="size-4" />
                </div>
              </div>

              <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stat.value}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-sans text-[11px] font-medium",
                  stat.isPrimary
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <SubIcon className="size-3" />
                <span className="tabular-nums font-semibold">{stat.subValue}</span>
                <span>{stat.subLabel}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
