"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  CalendarPlus,
  Search,
  Filter,
  Clock,
  MapPin,
  Users,
  Eye,
  AlertCircle,
  CheckCircle2,
  Send,
  RefreshCw,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { organizerFetch, type OrganizerEvent } from "@/lib/organizer-api";

const statusTabs = [
  { label: "All", value: "" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected rejection reason modal state
  const [rejectionModal, setRejectionModal] = useState<{
    open: boolean;
    title: string;
    reason: string | null;
    eventId: string;
  }>({
    open: false,
    title: "",
    reason: null,
    eventId: "",
  });

  // Submit for review loading state
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter) params.set("status", statusFilter);
      if (activeSearch) params.set("search", activeSearch);

      const res: any = await organizerFetch(`/events/organizer/my-events?${params.toString()}`);
      setEvents(res.data || []);
      setTotal(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err: any) {
      setError(err?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, activeSearch]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchTerm);
  }

  async function handleSubmitForReview(eventId: string) {
    setSubmittingId(eventId);
    try {
      await organizerFetch(`/events/${eventId}/submit`, {
        method: "PATCH",
      });
      toast.success("Event submitted for admin review successfully");
      fetchEvents();
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit event for review");
    } finally {
      setSubmittingId(null);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3" /> Published
          </span>
        );
      case "PENDING_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Clock className="size-3" /> Under Review
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-amber-600 dark:text-amber-400">
            <FileText className="size-3" /> Draft
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-destructive">
            <XCircle className="size-3" /> Rejected
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 font-sans text-xs font-semibold text-muted-foreground">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-xs font-semibold text-muted-foreground">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Events
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            Manage your event catalog, monitor review progress, and access event management workspaces.
          </p>
        </div>
        <Link
          href="/organizer/events/create"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98]"
        >
          <CalendarPlus className="size-4.5" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-card p-1.5">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`rounded-xl px-3.5 py-1.5 font-sans text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex w-full max-w-sm items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title..."
              className="h-10 rounded-xl pl-9 pr-4 font-sans text-xs"
            />
          </div>
          <Button type="submit" variant="outline" className="h-10 shrink-0 rounded-xl px-3 font-sans text-xs">
            Search
          </Button>
        </form>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <h3 className="mt-2 font-heading text-base font-semibold">Error loading events</h3>
          <p className="mt-1 font-sans text-xs text-muted-foreground">{error}</p>
          <Button onClick={fetchEvents} variant="outline" className="mt-4 gap-2 rounded-xl text-xs">
            <RefreshCw className="size-3.5" /> Try Again
          </Button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Calendar className="size-7" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            {statusFilter || activeSearch ? "No matching events found" : "No events created yet"}
          </h3>
          <p className="mt-1 max-w-sm font-sans text-sm text-muted-foreground">
            {statusFilter || activeSearch
              ? "Try clearing filters or search queries to view other events."
              : "Launch your first event experience and start configuring tickets and team members."}
          </p>
          {!statusFilter && !activeSearch && (
            <Link
              href="/organizer/events/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-primary-foreground shadow-sm"
            >
              <CalendarPlus className="size-4" /> Create Your First Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const totalQuota = event.ticketTypes.reduce((acc, tt) => acc + tt.quota, 0);
            const availableQuota = event.ticketTypes.reduce((acc, tt) => acc + tt.availableQuota, 0);
            const soldQuota = Math.max(0, totalQuota - availableQuota);
            const percentSold = totalQuota > 0 ? Math.round((soldQuota / totalQuota) * 100) : 0;
            const staffCount = event._count?.staffs || 0;

            return (
              <div
                key={event.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                {/* Poster Cover */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {event.coverImageUrl ? (
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                      <Calendar className="size-10" />
                    </div>
                  )}

                  <div className="absolute left-3 top-3">
                    {getStatusBadge(event.status)}
                  </div>

                  <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-sans text-[11px] font-semibold text-white backdrop-blur-xs">
                    {event.category.name}
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <div className="mt-3 space-y-1.5 font-sans text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 shrink-0 text-primary" />
                        <span>{formatDate(event.startDatetime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 shrink-0 text-primary" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="size-3.5 shrink-0 text-primary" />
                        <span>{staffCount} assigned crew</span>
                      </div>
                    </div>
                  </div>

                  {/* Quota & Action Footer */}
                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex items-center justify-between font-sans text-xs font-medium">
                      <span className="text-muted-foreground">Tickets Sold</span>
                      <span className="text-foreground">
                        {soldQuota} / {totalQuota} ({percentSold}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min(100, percentSold)}%` }}
                      />
                    </div>

                    {/* Contextual Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                      {event.status === "DRAFT" && (
                        <>
                          <Link
                            href={`/organizer/events/${event.id}`}
                            className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-sans text-xs font-semibold hover:bg-muted/60 transition-colors"
                          >
                            Edit
                          </Link>
                          {event.ticketTypes.length > 0 && (
                            <Button
                              size="sm"
                              className="h-8 rounded-xl px-3 font-sans text-xs font-semibold gap-1.5"
                              disabled={submittingId === event.id}
                              onClick={() => handleSubmitForReview(event.id)}
                            >
                              <Send className="size-3" />
                              {submittingId === event.id ? "Submitting..." : "Submit Review"}
                            </Button>
                          )}
                        </>
                      )}

                      {event.status === "REJECTED" && (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 rounded-xl px-3 font-sans text-xs font-semibold gap-1"
                            onClick={() =>
                              setRejectionModal({
                                open: true,
                                title: event.title,
                                reason: event.rejectionReason ?? null,
                                eventId: event.id,
                              })
                            }
                          >
                            View Reason
                          </Button>
                          <Link
                            href={`/organizer/events/${event.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 font-sans text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors"
                          >
                            Edit & Resubmit
                          </Link>
                        </>
                      )}

                      {event.status === "PENDING_REVIEW" && (
                        <Link
                          href={`/organizer/events/${event.id}`}
                          className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-sans text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye className="size-3.5" /> View Submission
                        </Link>
                      )}

                      {event.status === "PUBLISHED" && (
                        <>
                          <Link
                            href={`/events/${event.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-xl border border-border px-2.5 py-1.5 font-sans text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="size-3" /> Live
                          </Link>
                          <Link
                            href={`/organizer/events/${event.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 font-sans text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors"
                          >
                            <Eye className="size-3.5" /> Manage Workspace
                          </Link>
                        </>
                      )}

                      {(event.status === "CANCELLED" || event.status === "COMPLETED") && (
                        <Link
                          href={`/organizer/events/${event.id}`}
                          className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-sans text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye className="size-3.5" /> Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="font-sans text-xs text-muted-foreground">
            Showing page {page} of {totalPages} ({total} total events)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 rounded-xl px-2.5 font-sans text-xs"
            >
              <ChevronLeft className="size-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 rounded-xl px-2.5 font-sans text-xs"
            >
              Next <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Rejection Reason Dialog */}
      <Dialog
        open={rejectionModal.open}
        onOpenChange={(open) => setRejectionModal((prev) => ({ ...prev, open }))}
      >
        <DialogPopup className="max-w-md font-sans">
          <DialogTitle className="font-heading text-lg font-bold text-destructive flex items-center gap-2">
            <AlertCircle className="size-5" /> Event Revision Required
          </DialogTitle>
          <DialogDescription className="mt-2 text-xs text-muted-foreground">
            The administrator provided the following feedback for "{rejectionModal.title}":
          </DialogDescription>
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 font-sans text-sm text-foreground">
            {rejectionModal.reason || "No specific feedback reason was provided."}
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <DialogClose render={<Button variant="outline" className="rounded-xl font-sans text-xs" />}>
              Close
            </DialogClose>
            <Link
              href={`/organizer/events/${rejectionModal.eventId}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-sans text-xs font-semibold text-primary-foreground hover:bg-primary/95"
            >
              Open Event to Edit
            </Link>
          </div>
        </DialogPopup>
      </Dialog>
    </div>
  );
}
