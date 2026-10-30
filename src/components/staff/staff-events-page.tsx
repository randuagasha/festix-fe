"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Filter,
  MapPin,
  QrCode,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaffWorkspace } from "@/app/staff/layout";
import { staffFetch, StaffApiError, type StaffAssignedEvent } from "@/lib/staff-api";

export function StaffEventsPageContent() {
  const { openScanner, refreshKey } = useStaffWorkspace();
  const [events, setEvents] = useState<StaffAssignedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "published">("all");

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
          const msg = err instanceof StaffApiError ? err.message : "Failed to load events";
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

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return events.filter((evt) => {
      if (statusFilter === "active" && !evt.isActive) return false;
      if (statusFilter === "published" && evt.status !== "PUBLISHED") return false;

      if (!q) return true;
      const titleMatch = evt.title.toLowerCase().includes(q);
      const locMatch = evt.location.toLowerCase().includes(q);
      return titleMatch || locMatch;
    });
  }, [events, search, statusFilter]);

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Assigned Events Roster
        </h1>
        <p className="font-sans text-xs text-muted-foreground">
          Browse and operationalize events you are assigned to check-in attendees.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events by title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-sans text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border bg-card p-1">
          <Filter className="ml-2 size-3.5 text-muted-foreground" />
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-2.5 py-1 font-sans text-xs font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({events.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`rounded-lg px-2.5 py-1 font-sans text-xs font-medium transition-colors ${
              statusFilter === "active"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Now ({events.filter((e) => e.isActive).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`rounded-lg px-2.5 py-1 font-sans text-xs font-medium transition-colors ${
              statusFilter === "published"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Published ({events.filter((e) => e.status === "PUBLISHED").length})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Calendar className="size-6" />
          </div>
          <h3 className="mt-3 font-heading text-base font-bold">No Matching Events Found</h3>
          <p className="mx-auto mt-1 max-w-sm font-sans text-xs text-muted-foreground">
            Try adjusting your search query or status filter to see other assigned events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((evt) => {
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
  );
}
