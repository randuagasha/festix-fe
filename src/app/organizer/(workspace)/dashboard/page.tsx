"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  CalendarPlus,
  Ticket,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { organizerFetch, type OrganizerDashboardData } from "@/lib/organizer-api";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function OrganizerDashboardPage() {
  const [data, setData] = useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const res = await organizerFetch<OrganizerDashboardData>("/organizer/dashboard");
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-7">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="size-10 text-destructive" />
        <h2 className="mt-3 font-heading text-lg font-bold">Failed to load dashboard</h2>
        <p className="mt-1 font-sans text-sm text-muted-foreground">{error}</p>
        <Button onClick={loadDashboard} variant="outline" className="mt-5 gap-2 rounded-xl">
          <RefreshCw className="size-4" /> Try Again
        </Button>
      </div>
    );
  }

  const { metrics, upcomingEvents, actionItems, recentSales, organizationName } = data;
  const hasActionItems = actionItems.drafts.length > 0 || actionItems.rejected.length > 0;

  return (
    <div className="space-y-7 pb-10">
      {/* 1. Welcoming Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-foreground via-foreground/95 to-foreground p-6 text-background sm:p-8">
        <div className="absolute -right-20 -top-20 size-60 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 size-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 font-sans text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" /> {organizationName}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Organizer Command Center
            </h1>
            <p className="mt-2 font-sans text-sm leading-relaxed text-background/70 sm:text-base">
              Create immersive event experiences, track live ticket sales, manage your on-ground crew, and monitor attendee check-in.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/organizer/events/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-sans text-sm font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-primary/95 active:scale-[0.98]"
            >
              <CalendarPlus className="size-4.5" />
              <span>Create Event</span>
            </Link>
            <Link
              href="/organizer/events"
              className="inline-flex items-center gap-2 rounded-2xl border border-background/20 bg-background/10 px-4 py-3 font-sans text-sm font-medium text-white backdrop-blur-xs transition-colors hover:bg-background/20"
            >
              <Calendar className="size-4" />
              <span>My Events</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Scoped Metric Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Revenue */}
        <Card className="rounded-2xl border border-border bg-card shadow-xs transition-all hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Gross Revenue
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold text-foreground">
              {formatCurrency(metrics.grossRevenue)}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              From {metrics.paidOrdersCount} paid transactions
            </p>
          </CardContent>
        </Card>

        {/* Tickets Sold */}
        <Card className="rounded-2xl border border-border bg-card shadow-xs transition-all hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tickets Sold
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ticket className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold text-foreground">
              {metrics.totalTicketsSold.toLocaleString()}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Total issued tickets across events
            </p>
          </CardContent>
        </Card>

        {/* Active Published Events */}
        <Card className="rounded-2xl border border-border bg-card shadow-xs transition-all hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Published Events
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold text-foreground">
              {metrics.publishedEvents}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              {metrics.totalEvents} total created events
            </p>
          </CardContent>
        </Card>

        {/* Checked-in Attendees */}
        <Card className="rounded-2xl border border-border bg-card shadow-xs transition-all hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Checked-in
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <CheckCircle2 className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold text-foreground">
              {metrics.checkedInAttendees.toLocaleString()}
            </div>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Validated on-site attendees
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Action Items Banner (if any) */}
      {hasActionItems && (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 font-heading text-sm font-semibold text-amber-700 dark:text-amber-400">
            <AlertCircle className="size-4.5 shrink-0" />
            <span>Attention Needed ({actionItems.drafts.length + actionItems.rejected.length} items)</span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {actionItems.rejected.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-destructive/20 bg-card p-3.5 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-destructive">
                    <span className="size-2 rounded-full bg-destructive" />
                    Rejected by Admin
                  </div>
                  <h4 className="mt-1 font-heading text-sm font-bold text-foreground truncate">
                    {item.title}
                  </h4>
                  {item.rejectionReason && (
                    <p className="mt-1 line-clamp-2 font-sans text-xs text-muted-foreground">
                      "{item.rejectionReason}"
                    </p>
                  )}
                </div>
                <Link
                  href={`/organizer/events/${item.id}`}
                  className="mt-3 inline-flex items-center gap-1 font-sans text-xs font-semibold text-primary hover:underline"
                >
                  <span>Edit & Resubmit</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}

            {actionItems.drafts.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <span className="size-2 rounded-full bg-amber-500" />
                    Draft Incomplete
                  </div>
                  <h4 className="mt-1 font-heading text-sm font-bold text-foreground truncate">
                    {item.title}
                  </h4>
                  <p className="mt-1 font-sans text-xs text-muted-foreground">
                    {item.ticketTypesCount === 0
                      ? "Needs at least 1 ticket tier before submitting"
                      : "Ready to submit for review"}
                  </p>
                </div>
                <Link
                  href={`/organizer/events/${item.id}`}
                  className="mt-3 inline-flex items-center gap-1 font-sans text-xs font-semibold text-primary hover:underline"
                >
                  <span>Continue Editing</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Upcoming Events & Recent Sales Grid */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        {/* Upcoming Published Events (2 Cols) */}
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">Upcoming Events</h2>
              <p className="font-sans text-xs text-muted-foreground">Your active events scheduled soon</p>
            </div>
            <Link
              href="/organizer/events"
              className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-primary hover:underline"
            >
              <span>View All Events</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Calendar className="size-6" />
              </div>
              <h3 className="mt-3 font-heading text-sm font-semibold">No active upcoming events</h3>
              <p className="mt-1 max-w-xs font-sans text-xs text-muted-foreground">
                Publish events or submit your drafts to start selling tickets on Festix.
              </p>
              <Link
                href="/organizer/events/create"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-sans text-xs font-semibold text-primary-foreground shadow-xs"
              >
                <CalendarPlus className="size-3.5" /> Create Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {upcomingEvents.map((event) => {
                const percentSold =
                  event.totalQuota > 0
                    ? Math.round((event.soldQuota / event.totalQuota) * 100)
                    : 0;

                return (
                  <div
                    key={event.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {event.coverImageUrl ? (
                        <Image
                          src={event.coverImageUrl}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 350px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                          <Calendar className="size-8" />
                        </div>
                      )}
                      <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-sans text-[11px] font-semibold text-white backdrop-blur-xs">
                        {event.category}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="font-heading text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <div className="mt-2 space-y-1 font-sans text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3.5 shrink-0 text-primary" />
                            <span>{formatDate(event.startDatetime)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 shrink-0 text-primary" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-3">
                        <div className="flex items-center justify-between font-sans text-xs font-medium">
                          <span className="text-muted-foreground">Ticket Quota</span>
                          <span className="text-foreground">
                            {event.soldQuota} / {event.totalQuota} ({percentSold}%)
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.min(100, percentSold)}%` }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-end">
                          <Link
                            href={`/organizer/events/${event.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-sans text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Eye className="size-3.5" /> Manage Workspace
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Ticket Sales (1 Col) */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">Recent Ticket Sales</h2>
            <p className="font-sans text-xs text-muted-foreground">Live purchases for your events</p>
          </div>

          <Card className="rounded-2xl border border-border bg-card shadow-xs">
            <CardContent className="p-4">
              {recentSales.length === 0 ? (
                <div className="py-12 text-center">
                  <TrendingUp className="mx-auto size-8 text-muted-foreground/60" />
                  <p className="mt-2 font-sans text-xs text-muted-foreground">
                    No paid ticket sales recorded yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {recentSales.map((sale) => (
                    <div key={sale.orderId} className="flex items-center justify-between py-3">
                      <div className="min-w-0 flex-1 pr-3">
                        <p className="font-sans text-xs font-bold text-foreground truncate">
                          {sale.buyerName}
                        </p>
                        <p className="mt-0.5 font-sans text-[11px] text-muted-foreground truncate">
                          {sale.quantity}x {sale.ticketName} • {sale.eventTitle}
                        </p>
                        <span className="font-sans text-[10px] text-muted-foreground/80">
                          {formatDate(sale.createdAt)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(sale.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
