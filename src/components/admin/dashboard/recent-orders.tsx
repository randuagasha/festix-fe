import { ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecentOrder } from "./dashboard-types";
import {
  formatPaymentStatus,
  getPaymentStatusVariant,
  formatCompactIDR,
  formatRelativeDate,
} from "./dashboard-formatters";

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  const safeOrders = orders ?? [];

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:shadow-sm">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShoppingCart className="size-3.5" />
            </div>
            <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
              Recent Orders
            </h3>
          </div>
          <span className="font-sans text-xs text-muted-foreground">
            {safeOrders.length} latest
          </span>
        </div>

        {safeOrders.length === 0 ? (
          <p className="py-8 text-center font-sans text-xs text-muted-foreground">
            No orders placed yet.
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {safeOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs font-semibold text-foreground">
                      {order.orderNumber}
                    </span>
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="px-1.5 py-0 text-[10px]">
                      {formatPaymentStatus(order.paymentStatus)}
                    </Badge>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 font-sans text-[11px] text-muted-foreground">
                    <User className="size-2.5" />
                    <span className="truncate">
                      {order.purchaserName ?? order.purchaserEmail ?? "Guest"}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-heading text-xs font-bold tabular-nums text-foreground">
                    {formatCompactIDR(order.totalAmount)}
                  </span>
                  <span className="font-sans text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatRelativeDate(order.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
