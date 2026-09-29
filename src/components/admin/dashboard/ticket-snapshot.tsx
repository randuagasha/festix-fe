import Link from "next/link";
import {
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  User,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TicketStats, OrderStatusEntry } from "./dashboard-types";
import {
  formatNumber,
  formatPaymentStatus,
  getPaymentStatusVariant,
} from "./dashboard-formatters";

const paymentStatusIcons: Record<string, React.ElementType> = {
  PAID: CheckCircle2,
  PENDING: Clock,
  EXPIRED: AlertTriangle,
  FAILED: XCircle,
};

const paymentStatusColors: Record<string, string> = {
  PAID: "text-primary",
  PENDING: "text-amber-500",
  EXPIRED: "text-muted-foreground",
  FAILED: "text-destructive",
};

export function TicketSnapshot({
  tickets,
  paymentStatus = [],
}: {
  tickets: TicketStats;
  paymentStatus?: OrderStatusEntry[];
}) {
  const ticketItems = [
    {
      label: "Redeemed",
      value: tickets.redeemed,
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Validated at events",
    },
    {
      label: "Unredeemed",
      value: tickets.unredeemed,
      icon: Clock,
      color: "text-muted-foreground",
      bg: "bg-muted",
      description: "Awaiting event check-in",
    },
    {
      label: "Cancelled",
      value: tickets.cancelled,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      description: "Refunded or voided",
    },
  ];

  const totalPaymentOrders = paymentStatus.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {/* Ticket Lifecycle Panel */}
      <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:shadow-sm">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Ticket className="size-3.5" />
              </div>
              <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                Ticket Operations
              </h3>
            </div>
            <span className="font-sans text-xs font-semibold text-muted-foreground tabular-nums">
              {formatNumber(tickets.total)} Total Issued
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {ticketItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col justify-between rounded-lg border border-border/60 bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-muted-foreground">
                      {item.label}
                    </span>
                    <div className={`flex size-6 items-center justify-center rounded-md ${item.bg}`}>
                      <Icon className={`size-3.5 ${item.color}`} />
                    </div>
                  </div>
                  <p className="mt-2 font-heading text-lg font-bold tabular-nums text-foreground">
                    {formatNumber(item.value)}
                  </p>
                  <p className="mt-0.5 font-sans text-[10px] text-muted-foreground leading-tight">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Navigation Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="font-sans text-[11px] text-muted-foreground">
            Platform Links
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/landing-page"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-sans text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <span>Explore Events</span>
              <ExternalLink className="size-3" />
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-sans text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span>My Profile</span>
              <User className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Status Panel */}
      <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:shadow-sm">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <CreditCard className="size-3.5" />
              </div>
              <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                Payment Distribution
              </h3>
            </div>
            <span className="font-sans text-xs font-semibold text-muted-foreground tabular-nums">
              {formatNumber(totalPaymentOrders)} Orders Recorded
            </span>
          </div>

          {paymentStatus.length === 0 ? (
            <p className="py-6 text-center font-sans text-xs text-muted-foreground">
              No payment transactions recorded yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {paymentStatus.map((item) => {
                const Icon = paymentStatusIcons[item.status] ?? CreditCard;
                const color = paymentStatusColors[item.status] ?? "text-muted-foreground";
                const pct = totalPaymentOrders > 0
                  ? Math.round((item.count / totalPaymentOrders) * 100)
                  : 0;

                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between font-sans text-xs">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-3.5 ${color}`} />
                        <Badge
                          variant={getPaymentStatusVariant(item.status)}
                          className="px-1.5 py-0 text-[10px]"
                        >
                          {formatPaymentStatus(item.status)}
                        </Badge>
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

        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="font-sans text-[11px] text-muted-foreground">
            Transaction status summary
          </span>
          <span className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-muted-foreground">
            <span>Realtime aggregates</span>
            <ArrowRight className="size-3 text-muted-foreground/60" />
          </span>
        </div>
      </div>
    </div>
  );
}
