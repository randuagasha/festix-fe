"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  ArrowLeft,
  Receipt,
  User,
  CreditCard,
  Ticket,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { fetchAdminOrderDetail } from "@/components/admin/orders/orders-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminOrder } from "@/components/admin/orders/orders-types";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminOrderDetail(orderId);
        setOrder(data);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="size-8 text-destructive mb-2" />
        <p className="font-heading text-sm font-semibold">{error || "Order not found"}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const allIssuedTickets = order.orderItems.flatMap(
    (item) => item.issuedTickets || []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/orders" />}
            className="size-8 p-0"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold font-mono">
                {order.orderNumber}
              </h2>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Order ID: {order.id}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="font-heading text-xl font-bold text-primary">
            Rp {Number(order.totalAmount).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <User className="size-4 text-primary" />
              <span>Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{order.user?.fullName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{order.user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Customer ID</p>
              <p className="font-mono text-[11px] truncate">{order.userId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <CreditCard className="size-4 text-primary" />
              <span>Payment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Status</p>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <div>
              <p className="text-muted-foreground">Method</p>
              <p className="font-medium">{order.paymentMethod || "Payment Gateway"}</p>
            </div>
            {order.pgTransactionId && (
              <div>
                <p className="text-muted-foreground">Gateway Session ID</p>
                <p className="font-mono text-[11px] truncate">{order.pgTransactionId}</p>
              </div>
            )}
            {order.paymentUrl && order.paymentStatus === "PENDING" && (
              <div className="pt-1">
                <a
                  href={order.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <span>Open Payment Link</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Receipt className="size-4 text-primary" />
              <span>Order Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expires At</p>
              <p className="font-medium">{new Date(order.expiresAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Purchased Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border p-4 gap-3"
              >
                <div>
                  <p className="font-semibold text-xs">
                    {item.ticketType?.event?.title || "Event"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Tier: {item.ticketType?.name} &bull; Quantity: {item.quantity}
                  </p>
                  {item.ticketType?.event?.location && (
                    <p className="text-[11px] text-muted-foreground">
                      Location: {item.ticketType.event.location}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} &times; Rp {Number(item.price).toLocaleString("id-ID")}
                  </p>
                  <p className="font-heading text-sm font-bold text-primary">
                    Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issued Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Ticket className="size-4 text-primary" />
            <span>Issued Tickets ({allIssuedTickets.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allIssuedTickets.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {order.paymentStatus === "PAID"
                ? "No tickets generated."
                : "Tickets will be generated once payment is confirmed."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allIssuedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg border border-border p-3 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">
                      {ticket.ticketCode}
                    </span>
                    {ticket.isCancelled ? (
                      <Badge variant="destructive">Cancelled</Badge>
                    ) : ticket.isRedeemed ? (
                      <Badge variant="default">Redeemed</Badge>
                    ) : (
                      <Badge variant="outline">Unused</Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-0.5">
                    <p>Issued: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    {ticket.redeemedAt && (
                      <p>Redeemed: {new Date(ticket.redeemedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
