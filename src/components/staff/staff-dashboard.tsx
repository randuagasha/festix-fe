"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
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
import { staffFetch, StaffApiError, type StaffAssignedEvent } from "@/lib/staff-api";

export function StaffDashboardContent() {
  const { user, openScanner, refreshKey } = useStaffWorkspace();
  const [events, setEvents] = useState<StaffAssignedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const data = await staffFetch<StaffAssignedEvent[]>("/staff/events");
        if (active) {
          setEvents(data);
        }
      } catch (err) {
        if (active) {
          const msg = err instanceof StaffApiError ? err.message : "Failed to load assigned events";
          setError(msg);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  // Aggregate metrics
  const totalAssigned = events.length;
  const totalAttendees = events.reduce(
    (sum, evt) => sum + (evt.participantSummary?.totalParticipants || 0),
    0,
  );
  const totalRedeemed = events.reduce(
    (sum, evt) => sum + (evt.participantSummary?.totalRedeemed || 0),
    0,
  );
  const totalRemaining = Math.max(0, totalAttendees - totalRedeemed);
  const overallRate = totalAttendees > 0 ? Math.round((totalRedeemed / totalAttendees) * 100) : 0;

  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Staff Member");

  function formatDate(dt: string) {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" /> Operational Overview
            </span>
            <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight md:text-3xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Here&apos;s an overview of your assigned events, attendee arrival metrics, and quick ticket check-in.
            </p>
          </div>

          <Button
            onClick={() => openScanner()}
            size="lg"
            className="gap-2 rounded-2xl shadow-sm sm:self-center"
          >
            <QrCode className="size-5" />
            <span>Scan Ticket</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card className="rounded-2xl border p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted-foreground">Assigned Events</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-heading text-2xl font-bold md:text-3xl">
            {loading ? <Skeleton className="h-8 w-12" /> : totalAssigned}
          </div>
          <span className="mt-1 font-sans text-[11px] text-muted-foreground">Active event rosters</span>
        </Card>

        <Card className="rounded-2xl border p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted-foreground">Total Tickets</span>
            <Ticket className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-heading text-2xl font-bold md:text-3xl">
            {loading ? <Skeleton className="h-8 w-12" /> : totalAttendees}
          </div>
          <span className="mt-1 font-sans text-[11px] text-muted-foreground">Paid attendee tickets</span>
        </Card>

        <Card className="rounded-2xl border p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted-foreground">Redeemed</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400 md:text-3xl">
            {loading ? <Skeleton className="h-8 w-12" /> : totalRedeemed}
          </div>
          <span className="mt-1 font-sans text-[11px] text-muted-foreground">Checked-in attendees</span>
        </Card>

        <Card className="rounded-2xl border p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-muted-foreground">Arrival Rate</span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-primary md:text-3xl">
            {loading ? <Skeleton className="h-8 w-12" /> : `${overallRate}%`}
          </div>
          <span className="mt-1 font-sans text-[11px] text-muted-foreground">
            {totalRemaining} pending arrivals
          </span>
        </Card>
      </div>

      {/* Managed Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold">Your Managed Events</h2>
            <p className="font-sans text-xs text-muted-foreground">
              Events where you are designated to validate and redeem tickets.
            </p>
          </div>

          {events.length > 0 && (
            <Link
              href="/staff/events"
              className="font-sans text-xs font-semibold text-primary hover:underline"
            >
              View all ({events.length})
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-2xl border p-0">
                <Skeleton className="aspect-[16/9] w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2 w-full pt-2" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <ShieldAlert className="mx-auto size-8 text-destructive" />
            <p className="mt-2 font-heading text-sm font-semibold">Failed to load assigned events</p>
            <p className="mt-1 font-sans text-xs text-muted-foreground">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Calendar className="size-6" />
            </div>
            <h3 className="mt-3 font-heading text-base font-bold">No Assigned Events Yet</h3>
            <p className="mx-auto mt-1 max-w-sm font-sans text-xs text-muted-foreground">
              You haven&apos;t been assigned to any events. Event organizers will invite you to their operational staff team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((evt) => {
              const total = evt.participantSummary?.totalParticipants || 0;
              const redeemed = evt.participantSummary?.totalRedeemed || 0;
              const rate = total > 0 ? Math.round((redeemed / total) * 100) : 0;

              return (
                <Card
                  key={evt.id}
                  className="group overflow-hidden rounded-2xl border bg-card p-0 shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] bg-muted">
                    {evt.coverImageUrl ? (
                      <Image
                        src={evt.coverImageUrl}
                        alt={evt.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <Calendar className="size-8" />
                      </div>
                    )}

                    <div className="absolute left-3 top-3">
                      <Badge
                        variant="secondary"
                        className={`backdrop-blur-sm ${
                          evt.isActive
                            ? "bg-emerald-600/90 text-white"
                            : "bg-background/90 text-foreground"
                        }`}
                      >
                        {evt.isActive ? "Live Now" : evt.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4.5 space-y-3.5">
                    <div>
                      <h3 className="truncate font-heading text-base font-bold transition-colors group-hover:text-primary">
                        {evt.title}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                        <Clock className="size-3.5 shrink-0" />
                        <span>{formatDate(evt.startDatetime)}</span>
                      </div>
                    </div>

                    {/* Checkin Progress Bar */}
                    <div className="space-y-1.5 border-t pt-3">
                      <div className="flex justify-between font-sans text-xs">
                        <span className="text-muted-foreground">Redeemed:</span>
                        <span className="font-semibold text-foreground">
                          {redeemed} / {total} ({rate}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        className="flex-1 font-sans text-xs"
                        render={<Link href={`/staff/events/${evt.id}`} />}
                      >
                        Manage Event
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => openScanner(evt.id)}
                        className="gap-1.5 font-sans text-xs"
                      >
                        <QrCode className="size-3.5" />
                        Scan
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
