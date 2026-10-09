"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Calendar, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SearchInput } from "@/components/admin/shared/search-input";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { PaginationControls } from "@/components/admin/shared/pagination-controls";
import { fetchAdminEvents } from "@/components/admin/events/events-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminEvent, EventStatus } from "@/components/admin/events/events-types";
import type { PaginationMeta } from "@/lib/admin-types";

const statusFilters: { label: string; value: EventStatus | "ALL" }[] = [
  { label: "All Status", value: "ALL" },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (page = 1) => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetchAdminEvents({
          page,
          limit: 10,
          search: search || undefined,
          status: selectedStatus === "ALL" ? undefined : selectedStatus,
        });
        setEvents(response.data);
        setMeta(response.meta);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    },
    [router, search, selectedStatus]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  return (
    <div>
      <PageHeader
        title="Event Management"
        description="Review, approve, and manage events created by organizers."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            placeholder="Search events..."
            value={search}
            onChange={(val) => setSearch(val)}
          />
          <div className="flex flex-wrap gap-1">
            {statusFilters.map((sf) => (
              <Button
                key={sf.value}
                variant={selectedStatus === sf.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(sf.value)}
                className="h-8 text-xs"
              >
                {sf.label}
              </Button>
            ))}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {meta.total} {meta.total === 1 ? "event" : "events"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertCircle className="size-8 text-destructive mb-2" />
          <p className="font-heading text-sm font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => loadData(meta.page)} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Calendar className="size-8 text-muted-foreground mb-2" />
          <p className="font-heading text-sm font-semibold">No events found</p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {search || selectedStatus !== "ALL"
              ? "No events match the selected filters."
              : "No events have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const orgName =
                  event.organizer?.organizerProfile?.organizationName ||
                  event.organizer?.fullName ||
                  "-";

                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.location}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{orgName}</TableCell>
                    <TableCell>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        {event.category?.name || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(event.startDatetime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={event.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/events/${event.id}`} />}
                        className="size-8 p-0"
                      >
                        <Eye className="size-4 text-muted-foreground" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <PaginationControls
            meta={meta}
            onPageChange={(page) => loadData(page)}
          />
        </div>
      )}
    </div>
  );
}
