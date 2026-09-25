import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TicketStats } from "./dashboard-types";
import { formatNumber } from "./dashboard-formatters";

export function TicketSnapshot({ tickets }: { tickets: TicketStats }) {
  const items = [
    {
      label: "Redeemed",
      value: tickets.redeemed,
      description: "Checked in at events",
      color: "bg-primary",
    },
    {
      label: "Unredeemed",
      value: tickets.unredeemed,
      description: "Valid, awaiting check-in",
      color: "bg-secondary",
    },
    {
      label: "Cancelled",
      value: tickets.cancelled,
      description: "Voided or refunded",
      color: "bg-destructive",
    },
  ];

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ticket Overview</CardTitle>
            <CardDescription>
              Redemption and ticket lifecycle state
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="font-heading text-2xl font-bold">
              {formatNumber(tickets.total)}
            </span>
            <p className="font-sans text-xs text-muted-foreground">Total Issued</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-xl border p-4"
            >
              <div className={`mt-1 size-3 shrink-0 rounded-full ${item.color}`} />
              <div>
                <p className="font-heading text-xl font-bold tabular-nums">
                  {formatNumber(item.value)}
                </p>
                <p className="font-sans text-sm font-medium">{item.label}</p>
                <p className="font-sans text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
