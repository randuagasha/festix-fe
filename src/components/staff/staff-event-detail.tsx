"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  ShieldAlert,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaffWorkspace } from "@/app/staff/layout";
import { staffFetch, StaffApiError, type StaffEventDashboard } from "@/lib/staff-api";

export function StaffEventDetailContent() {
  const params = useParams();
  const eventId = params?.eventId as string;

  const { openScanner, refreshKey } = useStaffWorkspace();

  const [dashboard, setDashboard] = useState<StaffEventDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await staffFetch<StaffEventDashboard>(
          `/staff/events/${eventId}/dashboard`,
        );
        if (active) {
          setDashboard(data);
        }
      } catch (err) {
        if (active) {
          const msg =
            err instanceof StaffApiError
              ? err.message
              : "Failed to load event dashboard";
          setError(msg);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [eventId, refreshKey]);

  function formatDate(dt: string) {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatTime(dt: string) {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/staff/events" />}
          className="gap-1.5 font-sans text-xs text-muted-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to My Events
        </Button>

        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
          <ShieldAlert className="mx-auto size-10 text-destructive" />
          <h2 className="mt-3 font-heading text-lg font-bold">
            Access Error
          </h2>
          <p className="mx-auto mt-1 max-w-md font-sans text-xs text-muted-foreground">
            {error || "Event not found or you are not authorized to operationalize tickets for this event."}
          </p>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/staff/events" />}
            className="mt-5"
          >
            Return to Assigned Events
          </Button>
        </div>
      </div>
    );
  }

  const { event, statistics, recentRedemptions } = dashboard;

  return (
    <div className="space-y-7">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/staff/events" />}
          className="gap-1.5 font-sans text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to My Events
        </Button>
      </div>

      {/* Event Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={
                  event.isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-foreground"
                }
              >
                {event.isActive ? "Live Now" : event.status}
              </Badge>
              <span className="font-sans text-xs text-muted-foreground">
                Operational Event ID: {event.id.slice(0, 8)}...
              </span>
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-sans text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="size-4 text-primary shrink-0" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary shrink-0" />
                <span>
                  {formatDate(event.startDatetime)} – {formatDate(event.endDatetime)}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => openScanner(event.id)}
            size="lg"
            className="gap-2 rounded-2xl shadow-sm sm:self-center bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <QrCode className="size-5" />
            <span>Scan &amp; Redeem Tickets</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card className="rounded-2xl border p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted-foreground">Eligible Tickets</span>
            <Ticket className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-heading text-2xl font-bold md:text-3xl">
            {statistics.totalParticipants}
          </div>
          <span className="mt-1 font-sans text-[11px] text-muted-foreground">Purchased attendee passes</span>
        </Card>

        <Card className="rounded-2xl border p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted-foreground">Checked-in</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400 md:text-3xl">
            {statistics.totalRedeemed}
          </div>
          <span className="mt-1 font-sans text-[11px] text-muted-foreground">Successfully verified</span>
        </Card>

        <Card className="rounded-2xl border p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted-foreground">Remaining</span>
            <Clock className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-heading text-2xl font-bold md:text-3xl">
            {statistics.remainingTickets}
          </div>
          <span className="mt-1 font-sans text-[11px] text-muted-foreground">Yet to arrive</span>
        </Card>

        <Card className="rounded-2xl border p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted-foreground">Redemption Rate</span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-primary md:text-3xl">
            {statistics.redemptionRate}%
          </div>
          <span className="mt-1 font-sans text-[11px] text-muted-foreground">Total arrival percentage</span>
        </Card>
      </div>

      {/* Visual Redemption Progress Bar */}
      <Card className="rounded-2xl border p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="font-heading text-sm font-bold">Attendance Progress</h3>
          </div>
          <span className="font-sans text-xs font-semibold text-primary">
            {statistics.totalRedeemed} of {statistics.totalParticipants} attendees ({statistics.redemptionRate}%)
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${statistics.redemptionRate}%` }}
          />
        </div>

        <div className="flex justify-between font-sans text-[11px] text-muted-foreground pt-1">
          <span>0 redeemed</span>
          <span>{statistics.remainingTickets} pending entrance</span>
          <span>{statistics.totalParticipants} capacity</span>
        </div>
      </Card>

      {/* Instructions & Recent Activity Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Activity (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold">Recent Redemptions</h3>
            <span className="font-sans text-xs text-muted-foreground">
              Last {recentRedemptions.length} scanned tickets
            </span>
          </div>

          {recentRedemptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center">
              <Ticket className="mx-auto size-7 text-muted-foreground" />
              <p className="mt-2 font-sans text-xs text-muted-foreground">
                No tickets have been redeemed for this event yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
              <table className="w-full text-left font-sans text-xs">
                <thead className="border-b bg-muted/40 text-[11px] font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Ticket Code</th>
                    <th className="p-3.5">Attendee</th>
                    <th className="p-3.5">Tier</th>
                    <th className="p-3.5 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentRedemptions.map((red) => (
                    <tr key={red.id} className="hover:bg-muted/30">
                      <td className="p-3.5 font-mono font-bold text-primary">
                        {red.ticketCode}
                      </td>
                      <td className="p-3.5 font-semibold text-foreground">
                        {red.buyerName}
                      </td>
                      <td className="p-3.5 text-muted-foreground">
                        {red.ticketType}
                      </td>
                      <td className="p-3.5 text-right font-mono text-[11px] text-muted-foreground">
                        {formatTime(red.redeemedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Instructions (1 col) */}
        <div className="space-y-3">
          <h3 className="font-heading text-base font-bold">How Redemption Works</h3>

          <div className="space-y-3 rounded-2xl border bg-card p-4.5 shadow-xs font-sans text-xs">
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                1
              </span>
              <div>
                <p className="font-semibold text-foreground">Attendee displays QR</p>
                <p className="mt-0.5 text-muted-foreground">
                  Customer presents their e-ticket QR code from My Tickets.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                2
              </span>
              <div>
                <p className="font-semibold text-foreground">Scan with Webcam</p>
                <p className="mt-0.5 text-muted-foreground">
                  Click the Scan button and position QR code inside the frame.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                3
              </span>
              <div>
                <p className="font-semibold text-foreground">Review Information</p>
                <p className="mt-0.5 text-muted-foreground">
                  Check attendee name, ticket tier, and validation status.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                4
              </span>
              <div>
                <p className="font-semibold text-foreground">Confirm Entry</p>
                <p className="mt-0.5 text-muted-foreground">
                  Press Confirm Redemption to atomically record arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
