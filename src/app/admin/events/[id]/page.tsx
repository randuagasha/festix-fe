"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  Clock,
  User,
  Tag,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import {
  fetchAdminEventDetail,
  approveEvent,
  rejectEvent,
  cancelEvent,
} from "@/components/admin/events/events-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminEvent } from "@/components/admin/events/events-types";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();

  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminEventDetail(eventId);
        setEvent(data);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId, router]);

  async function handleApprove() {
    setActionLoading(true);
    try {
      const res = await approveEvent(eventId);
      toast.success(res.message);
      setEvent(res.event);
      setApproveDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setActionLoading(true);
    try {
      const res = await rejectEvent(eventId, reason.trim());
      toast.success(res.message);
      setEvent(res.event);
      setRejectDialogOpen(false);
      setReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!reason.trim()) {
      toast.error("Cancellation reason is required");
      return;
    }

    setActionLoading(true);
    try {
      const res = await cancelEvent(eventId, reason.trim());
      toast.success(res.message);
      setEvent(res.event);
      setCancelDialogOpen(false);
      setReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="size-8 text-destructive mb-2" />
        <p className="font-heading text-sm font-semibold">{error || "Event not found"}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const isPending = event.status === "PENDING_REVIEW";
  const isPublished = event.status === "PUBLISHED";
  const orgName =
    event.organizer?.organizerProfile?.organizationName ||
    event.organizer?.fullName ||
    "-";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/events" />}
            className="size-8 p-0"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold">{event.title}</h2>
              <StatusBadge status={event.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              ID: {event.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPending && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => setApproveDialogOpen(true)}
                className="gap-1.5"
              >
                <CheckCircle2 className="size-4" />
                <span>Approve</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setRejectDialogOpen(true)}
                className="gap-1.5"
              >
                <XCircle className="size-4" />
                <span>Reject</span>
              </Button>
            </>
          )}

          {isPublished && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCancelDialogOpen(true)}
              className="gap-1.5"
            >
              <AlertTriangle className="size-4" />
              <span>Cancel Event</span>
            </Button>
          )}
        </div>
      </div>

      {event.rejectionReason && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="font-heading text-xs font-semibold text-destructive">
            Rejection / Cancellation Reason:
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {event.rejectionReason}
          </p>
        </div>
      )}

      {/* Cover image */}
      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">About Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-xs text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Ticket Types</CardTitle>
            </CardHeader>
            <CardContent>
              {event.ticketTypes.length === 0 ? (
                <p className="text-xs text-muted-foreground">No ticket types created yet.</p>
              ) : (
                <div className="space-y-3">
                  {event.ticketTypes.map((tt) => (
                    <div
                      key={tt.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Ticket className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{tt.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Quota: {tt.availableQuota} / {tt.quota}
                          </p>
                        </div>
                      </div>
                      <span className="font-heading text-xs font-bold text-primary">
                        Rp {Number(tt.price).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2.5">
                <Calendar className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Dates</p>
                  <p className="text-xs">
                    {new Date(event.startDatetime).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    to {new Date(event.endDatetime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Location</p>
                  <p className="text-xs">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Tag className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Category</p>
                  <p className="text-xs">{event.category?.name || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Organizer</p>
                  <p className="text-xs font-medium">{orgName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {event.organizer?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Created</p>
                  <p className="text-xs">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Dialog */}
      <ConfirmDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        title="Approve Event"
        description={`Are you sure you want to approve "${event.title}"? Once approved, the event will be published immediately.`}
        confirmLabel="Approve Event"
        onConfirm={handleApprove}
        loading={actionLoading}
      />

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogPopup>
          <div className="flex flex-col gap-2">
            <DialogTitle>Reject Event</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this event. The organizer will see this reason.
            </DialogDescription>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs font-medium">Rejection Reason</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Incomplete details, invalid venue info"
              required
            />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !reason.trim()}
            >
              {actionLoading ? "Rejecting..." : "Reject Event"}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogPopup>
          <div className="flex flex-col gap-2">
            <DialogTitle>Cancel Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this event? Events with existing paid orders cannot be cancelled via this action.
            </DialogDescription>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs font-medium">Cancellation Reason</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Organizer requested cancellation"
              required
            />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={actionLoading}
            >
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={actionLoading || !reason.trim()}
            >
              {actionLoading ? "Cancelling..." : "Cancel Event"}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </div>
  );
}
