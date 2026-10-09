"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  ArrowLeft,
  Shield,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  fetchAdminStaffDetail,
  assignStaffToEvent,
  removeStaffAssignment,
} from "@/components/admin/staff/staff-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminStaffUser, StaffAssignedEvent } from "@/components/admin/staff/staff-types";

export default function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const staffId = resolvedParams.id;
  const router = useRouter();

  const [staff, setStaff] = useState<AdminStaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assign dialog
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [eventIdInput, setEventIdInput] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Remove dialog
  const [selectedAssignment, setSelectedAssignment] = useState<StaffAssignedEvent | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

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
        const data = await fetchAdminStaffDetail(staffId);
        setStaff(data);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load staff details");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [staffId, router]);

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!eventIdInput.trim()) return;

    setAssignLoading(true);
    try {
      const res = await assignStaffToEvent(staffId, eventIdInput.trim());
      toast.success(res.message);
      setStaff((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          assignedEvents: [res.assignment, ...(prev.assignedEvents || [])],
        };
      });
      setAssignDialogOpen(false);
      setEventIdInput("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssignLoading(false);
    }
  }

  async function handleRemove() {
    if (!selectedAssignment) return;

    setRemoveLoading(true);
    try {
      const res = await removeStaffAssignment(selectedAssignment.id);
      toast.success(res.message);
      setStaff((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          assignedEvents: (prev.assignedEvents || []).filter(
            (a) => a.id !== selectedAssignment.id
          ),
        };
      });
      setRemoveDialogOpen(false);
      setSelectedAssignment(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove assignment");
    } finally {
      setRemoveLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="size-8 text-destructive mb-2" />
        <p className="font-heading text-sm font-semibold">{error || "Staff not found"}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const initial = staff.fullName?.charAt(0).toUpperCase() || "S";
  const assignments = staff.assignedEvents || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/staff" />}
            className="size-8 p-0"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold">{staff.fullName}</h2>
              <Badge variant="secondary">STAFF</Badge>
              {staff.isSuspended && <Badge variant="destructive">Suspended</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{staff.email}</p>
          </div>
        </div>

        <Button
          onClick={() => setAssignDialogOpen(true)}
          disabled={staff.isSuspended}
          className="gap-2"
        >
          <Plus className="size-4" />
          <span>Assign to Event</span>
        </Button>
      </div>

      {/* Staff Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar size="lg" className="size-16">
                {staff.avatar && <AvatarImage src={staff.avatar} alt={staff.fullName} />}
                <AvatarFallback className="bg-primary/10 font-heading text-xl font-bold text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-heading font-semibold text-base">{staff.fullName}</p>
                <p className="text-xs text-muted-foreground">{staff.email}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Staff ID: {staff.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
              <div>
                <p className="text-muted-foreground">Assigned Events</p>
                <p className="font-heading text-lg font-bold text-primary">
                  {assignments.length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(staff.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="size-4 text-primary" />
            <span>Assigned Events ({assignments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground">
              <Shield className="size-8 text-muted-foreground/50 mb-2" />
              <p>No events currently assigned to this staff member.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssignDialogOpen(true)}
                className="mt-3 gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Assign Event</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border p-4 gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-xs">
                        {assignment.event?.title || "Event"}
                      </p>
                      {assignment.event?.status && (
                        <StatusBadge status={assignment.event.status} />
                      )}
                    </div>
                    {assignment.event?.location && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Location: {assignment.event.location}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      Assigned on: {new Date(assignment.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/admin/events/${assignment.eventId}`} />}
                      className="text-xs"
                    >
                      View Event
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setRemoveDialogOpen(true)}
                      }
                      className="text-destructive hover:text-destructive size-8 p-0"
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogPopup>
          <form onSubmit={handleAssign}>
            <div className="flex flex-col gap-2">
              <DialogTitle>Assign Staff to Event</DialogTitle>
              <DialogDescription>
                Enter the Event ID (UUID) that {staff.fullName} should have scanner access for.
              </DialogDescription>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <label className="text-xs font-medium">Event ID</label>
              <Input
                value={eventIdInput}
                onChange={(e) => setEventIdInput(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                required
              />
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAssignDialogOpen(false)}
                disabled={assignLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={assignLoading || !eventIdInput.trim()}>
                {assignLoading ? "Assigning..." : "Assign Staff"}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </Dialog>

      {/* Remove Confirm Dialog */}
      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove Staff Assignment"
        description={`Are you sure you want to remove ${staff.fullName} from "${selectedAssignment?.event?.title}"? They will no longer be able to scan tickets for this event.`}
        confirmLabel="Remove Assignment"
        variant="destructive"
        onConfirm={handleRemove}
        loading={removeLoading}
      />
    </div>
  );
}
