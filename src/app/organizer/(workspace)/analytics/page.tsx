"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  DollarSign,
  Ticket,
  Users,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { organizerFetch, type OrganizerDashboardData, type OrganizerEvent } from "@/lib/organizer-api";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrganizerAnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<OrganizerDashboardData | null>(null);
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [dash, evts]: [any, any] = await Promise.all([
        organizerFetch("/organizer/dashboard"),
        organizerFetch("/events/organizer/my-events?limit=50"),
      ]);
      setDashboardData(dash);
      setEvents(evts.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mx-auto size-10 text-destructive" />
        <h2 className="mt-2 font-heading text-lg font-bold">Failed to load analytics</h2>
        <p className="mt-1 font-sans text-xs text-muted-foreground">{error}</p>
        <Button onClick={loadData} variant="outline" className="mt-4 gap-2 rounded-xl text-xs">
          <RefreshCw className="size-3.5" /> Try Again
        </Button>
      </div>
    );
  }

  const { metrics, organizationName } = dashboardData;

  // Calculate total quota across all events
  const totalCapacity = events.reduce(
    (acc, evt) => acc + evt.ticketTypes.reduce((sum, tt) => sum + tt.quota, 0),
    0
  );
  const totalAvailable = events.reduce(
    (acc, evt) => acc + evt.ticketTypes.reduce((sum, tt) => sum + tt.availableQuota, 0),
    0
  );
  const totalSold = Math.max(0, totalCapacity - totalAvailable);
  const overallCapacityRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-7 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Performance & Analytics
          </h1>
          <p className="font-sans text-xs text-muted-foreground sm:text-sm">
            Audited financial revenue, ticket sales distribution, and attendance metrics for {organizationName}.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          className="gap-1.5 rounded-xl font-sans text-xs self-start sm:self-auto"
        >
          <RefreshCw className="size-3.5" /> Refresh Metrics
        </Button>
      </div>

      {/* 4 Financial & Sales Metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Gross Volume
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-foreground">
            {formatCurrency(metrics.grossRevenue)}
          </div>
          <span className="mt-1 block font-sans text-[11px] text-muted-foreground">
            Paid orders from customers
          </span>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tickets Issued
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ticket className="size-4" />
            </div>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-foreground">
            {metrics.totalTicketsSold.toLocaleString()}
          </div>
          <span className="mt-1 block font-sans text-[11px] text-muted-foreground">
            Cumulative sold tickets
          </span>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Capacity Fill Rate
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-foreground">
            {overallCapacityRate}%
          </div>
          <span className="mt-1 block font-sans text-[11px] text-muted-foreground">
            {totalSold} / {totalCapacity} quota sold
          </span>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider">
              On-Site Check-ins
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-foreground">
            {metrics.checkedInAttendees.toLocaleString()}
          </div>
          <span className="mt-1 block font-sans text-[11px] text-muted-foreground">
            Scanned by authorized crew
          </span>
        </Card>
      </section>

      {/* Event Contribution Table */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">Event Revenue & Quota Breakdown</h2>
          <p className="font-sans text-xs text-muted-foreground">
            Performance comparison across all your created events.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <Calendar className="mx-auto size-8 text-muted-foreground/60" />
            <p className="mt-2 font-sans text-xs text-muted-foreground">
              No event performance data available yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <table className="w-full text-left font-sans text-xs">
              <thead className="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4">Event Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Sold / Total Quota</th>
                  <th className="p-4">Capacity %</th>
                  <th className="p-4 text-right">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {events.map((evt) => {
                  const evtTotal = evt.ticketTypes.reduce((a, t) => a + t.quota, 0);
                  const evtAvail = evt.ticketTypes.reduce((a, t) => a + t.availableQuota, 0);
                  const evtSold = Math.max(0, evtTotal - evtAvail);
                  const evtPercent = evtTotal > 0 ? Math.round((evtSold / evtTotal) * 100) : 0;

                  return (
                    <tr key={evt.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">
                        <span className="truncate max-w-[240px] block">{evt.title}</span>
                      </td>
                      <td className="p-4 text-muted-foreground">{evt.category.name}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                          {evt.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        {evtSold} / {evtTotal}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-primary" style={{ width: `${evtPercent}%` }} />
                          </div>
                          <span className="font-semibold">{evtPercent}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/organizer/events/${evt.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          <span>Manage</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
