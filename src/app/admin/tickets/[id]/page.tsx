"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  ArrowLeft,
  Ticket,
  Calendar,
  User,
  Receipt,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { fetchAdminTicketDetail } from "@/components/admin/tickets/tickets-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminTicket } from "@/components/admin/tickets/tickets-types";

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;
  const router = useRouter();

  const [ticket, setTicket] = useState<AdminTicket | null>(null);
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
        const data = await fetchAdminTicketDetail(ticketId);
        setTicket(data);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [ticketId, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="size-8 text-destructive mb-2" />
        <p className="font-heading text-sm font-semibold">{error || "Ticket not found"}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const event = ticket.orderItem?.ticketType?.event;
  const ticketType = ticket.orderItem?.ticketType;
  const order = ticket.orderItem?.order;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/tickets" />}
            className="size-8 p-0"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold font-mono">
                {ticket.ticketCode}
              </h2>
              {ticket.isCancelled ? (
                <Badge variant="destructive">Cancelled</Badge>
              ) : ticket.isRedeemed ? (
                <Badge variant="default">Redeemed</Badge>
              ) : (
                <Badge variant="outline">Unused</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ticket ID: {ticket.id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="size-4 text-primary" />
              <span>Event Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Event Title</p>
              <p className="font-semibold">{event?.title || "-"}</p>
            </div>
            {event?.location && (
              <div className="flex items-start gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            )}
            {event?.startDatetime && (
              <div className="flex items-start gap-1.5">
                <Clock className="size-3.5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Start Time</p>
                  <p className="font-medium">
                    {new Date(event.startDatetime).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ticket Tier & Order */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Ticket className="size-4 text-primary" />
              <span>Ticket & Order</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Tier Name</p>
              <p className="font-semibold">{ticketType?.name || "-"}</p>
            </div>
            {ticketType?.price !== undefined && (
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-heading font-bold text-primary">
                  Rp {Number(ticketType.price).toLocaleString("id-ID")}
                </p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Order Number</p>
              <Link
                href={`/admin/orders/${order?.id}`}
                className="font-mono text-primary hover:underline"
              >
                {order?.orderNumber || "-"}
              </Link>
            </div>
            <div>
              <p className="text-muted-foreground">Order Status</p>
              <Badge variant="outline">{order?.paymentStatus || "-"}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Status & Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <User className="size-4 text-primary" />
              <span>Customer & Redemption</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Ticket Holder</p>
              <p className="font-medium">{order?.user?.fullName || "-"}</p>
              <p className="text-[11px] text-muted-foreground">{order?.user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Issued At</p>
              <p className="font-medium">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Redeemed Status</p>
              <p className="font-medium">
                {ticket.isRedeemed ? (
                  <span className="text-primary font-semibold">
                    Redeemed on{" "}
                    {ticket.redeemedAt
                      ? new Date(ticket.redeemedAt).toLocaleString()
                      : "recorded date"}
                  </span>
                ) : (
                  "Not yet redeemed"
                )}
              </p>
            </div>
            {ticket.isCancelled && (
              <div>
                <p className="text-muted-foreground">Cancellation</p>
                <p className="text-destructive font-medium">Ticket is marked cancelled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
