import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecentOrder } from "./dashboard-types";
import {
  formatPaymentStatus,
  getPaymentStatusVariant,
  formatIDR,
  formatRelativeDate,
} from "./dashboard-formatters";

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  const safeOrders = orders ?? [];

  if (safeOrders.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest transactions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">
            No orders found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest transactions across the platform</CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        {safeOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {order.orderNumber}
                </span>
                <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                  {formatPaymentStatus(order.paymentStatus)}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {order.purchaserName ?? order.purchaserEmail ?? "Guest purchaser"}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-heading text-sm font-semibold">
                {formatIDR(order.totalAmount)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(order.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
