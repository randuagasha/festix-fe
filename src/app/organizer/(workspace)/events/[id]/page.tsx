"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Send,
  ExternalLink,
  ChevronLeft,
  XCircle,
  Sparkles,
  BarChart3,
  RefreshCw,
  Search,
  Loader2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  organizerFetch,
  type OrganizerEvent,
  type OrganizerCheckinData,
} from "@/lib/organizer-api";

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
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function EventWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = use(params);

  const [event, setEvent] = useState<OrganizerEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tickets" | "team" | "checkin" | "analytics">("overview");

  // Check-in data for Tab 4
  const [checkinData, setCheckinData] = useState<OrganizerCheckinData | null>(null);
  const [loadingCheckin, setLoadingCheckin] = useState(false);

  // Modals state
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [tierName, setTierName] = useState("");
  const [tierPrice, setTierPrice] = useState("");
  const [tierQuota, setTierQuota] = useState("");
  const [savingTier, setSavingTier] = useState(false);

  // Edit Tier Modal
  const [editTierModal, setEditTierModal] = useState<{
    open: boolean;
    id: string;
    name: string;
    price: string;
    quota: string;
  }>({
    open: false,
    id: "",
    name: "",
    price: "",
    quota: "",
  });

  // Submit for Review loading
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  async function loadEvent() {
    setLoading(true);
    setError(null);
    try {
      const data: any = await organizerFetch(`/events/organizer/${eventId}`);
      setEvent(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  }

  async function loadCheckinData() {
    setLoadingCheckin(true);
    try {
      const data: any = await organizerFetch(`/events/organizer/${eventId}/checkin`);
      setCheckinData(data);
    } catch {
      // non-published events or error
    } finally {
      setLoadingCheckin(false);
    }
  }

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (activeTab === "checkin") {
      loadCheckinData();
    }
  }, [activeTab, eventId]);

  async function handleCreateTicketTier(e: React.FormEvent) {
    e.preventDefault();
    if (!tierName.trim() || !tierPrice || !tierQuota) {
      toast.error("Please fill in all ticket tier fields");
      return;
    }

    setSavingTier(true);
    try {
      await organizerFetch(`/ticket-types/event/${eventId}`, {
        method: "POST",
        body: JSON.stringify({
          name: tierName.trim(),
          price: Number(tierPrice),
          quota: Number(tierQuota),
        }),
      });
      toast.success("Ticket tier created successfully");
      setTierModalOpen(false);
      setTierName("");
      setTierPrice("");
      setTierQuota("");
      loadEvent();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create ticket tier");
    } finally {
      setSavingTier(false);
    }
  }

  async function handleUpdateTicketTier(e: React.FormEvent) {
    e.preventDefault();
    try {
      await organizerFetch(`/ticket-types/${editTierModal.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editTierModal.name.trim(),
          price: Number(editTierModal.price),
          quota: Number(editTierModal.quota),
        }),
      });
      toast.success("Ticket tier updated successfully");
      setEditTierModal((prev) => ({ ...prev, open: false }));
      loadEvent();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update ticket tier");
    }
  }

  async function handleDeleteTicketTier(tierId: string) {
    if (!confirm("Are you sure you want to delete this ticket tier?")) return;
    try {
      await organizerFetch(`/ticket-types/${tierId}`, {
        method: "DELETE",
      });
      toast.success("Ticket tier deleted successfully");
      loadEvent();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete ticket tier");
    }
  }

  async function handleRemoveStaff(assignmentId: string) {
    if (!confirm("Remove this staff member from this event?")) return;
    try {
      await organizerFetch(`/events/organizer/${eventId}/staff/${assignmentId}`, {
        method: "DELETE",
      });
      toast.success("Staff member removed from event");
      loadEvent();
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove staff assignment");
    }
  }

  async function handleSubmitReview() {
    if (!event || event.ticketTypes.length === 0) {
      toast.error("Please add at least one ticket tier before submitting for review");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await organizerFetch(`/events/${eventId}/submit`, {
        method: "PATCH",
      });
      toast.success("Event submitted for admin review successfully!");
      loadEvent();
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit event for review");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-60 w-full rounded-3xl" />
        <Skeleton className="h-12 w-96 rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="size-10 text-destructive" />
        <h2 className="mt-2 font-heading text-lg font-bold">Failed to load event</h2>
        <p className="mt-1 font-sans text-xs text-muted-foreground">{error}</p>
        <Link
          href="/organizer/events"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 font-sans text-xs font-semibold"
        >
          <ChevronLeft className="size-4" /> Back to My Events
        </Link>
      </div>
    );
  }

  const totalQuota = event.ticketTypes.reduce((acc, tt) => acc + tt.quota, 0);
  const availableQuota = event.ticketTypes.reduce((acc, tt) => acc + tt.availableQuota, 0);
  const soldQuota = Math.max(0, totalQuota - availableQuota);
  const percentSold = totalQuota > 0 ? Math.round((soldQuota / totalQuota) * 100) : 0;
  const activeStaff = event.staffs || [];
  const pendingStaff = event.staffInvitations || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Back button */}
      <Link
        href="/organizer/events"
        className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" /> Back to My Events
      </Link>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
        {event.coverImageUrl ? (
          <div className="relative h-64 w-full bg-black sm:h-72">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="rounded-full bg-primary px-3 py-1 font-sans text-xs font-bold text-primary-foreground">
                  {event.category.name}
                </span>
                <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
                  {event.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-4 font-sans text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" /> {formatDate(event.startDatetime)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" /> {event.location}
                  </span>
                </div>
              </div>

              {event.status === "PUBLISHED" && (
                <Link
                  href={`/events/${event.id}`}
                  target="_blank"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white/20 px-4 py-2 font-sans text-xs font-semibold text-white backdrop-blur-md hover:bg-white/30 transition-colors"
                >
                  <ExternalLink className="size-3.5" /> View Public Page
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h1 className="font-heading text-2xl font-bold">{event.title}</h1>
          </div>
        )}

        {/* Tab Navigation Strip */}
        <div className="flex border-t border-border/80 bg-card px-4 sm:px-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Calendar },
            { id: "tickets", label: `Tickets (${event.ticketTypes.length})`, icon: Ticket },
            { id: "team", label: `Team (${activeStaff.length + pendingStaff.length})`, icon: Users },
            { id: "checkin", label: "Check-in Monitor", icon: CheckCircle2 },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 font-sans text-xs font-semibold transition-all ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Status Alert Banners */}
          {event.status === "REJECTED" && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-destructive">
                <XCircle className="size-5" /> Event Revision Required by Admin
              </div>
              <p className="mt-2 font-sans text-xs text-foreground leading-relaxed">
                Rejection feedback: "{event.rejectionReason || "Please review event details and ticket tiers."}"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="rounded-xl font-sans text-xs font-semibold gap-1.5"
                >
                  <Send className="size-3.5" />
                  {isSubmittingReview ? "Submitting..." : "Resubmit for Review"}
                </Button>
              </div>
            </div>
          )}

          {event.status === "DRAFT" && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div>
                <div className="flex items-center gap-2 font-heading text-sm font-bold text-amber-700 dark:text-amber-400">
                  <AlertCircle className="size-5" /> Draft Status
                </div>
                <p className="mt-1 font-sans text-xs text-muted-foreground">
                  {event.ticketTypes.length === 0
                    ? "You must add at least one ticket tier before submitting this event for review."
                    : "Your event is ready to be submitted for admin review and publication."}
                </p>
              </div>
              {event.ticketTypes.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="rounded-xl font-sans text-xs font-semibold gap-1.5 shrink-0"
                >
                  <Send className="size-3.5" />
                  {isSubmittingReview ? "Submitting..." : "Submit for Review"}
                </Button>
              )}
            </div>
          )}

          {event.status === "PENDING_REVIEW" && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-blue-700 dark:text-blue-400">
                <Clock className="size-5" /> Under Administrative Review
              </div>
              <p className="mt-1 font-sans text-xs text-muted-foreground">
                Your event has been submitted to the Tixora curation team. Once approved, the event will go live automatically, and pending staff invitations will activate.
              </p>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <span className="font-sans text-xs font-medium text-muted-foreground">Capacity / Sold</span>
              <div className="mt-1 font-heading text-2xl font-bold">
                {soldQuota} / {totalQuota}
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${percentSold}%` }} />
              </div>
            </Card>

            <Card className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <span className="font-sans text-xs font-medium text-muted-foreground">Ticket Tiers</span>
              <div className="mt-1 font-heading text-2xl font-bold">
                {event.ticketTypes.length} configured
              </div>
              <p className="mt-1 font-sans text-xs text-muted-foreground">
                Available in Tickets tab
              </p>
            </Card>

            <Card className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <span className="font-sans text-xs font-medium text-muted-foreground">Event Crew</span>
              <div className="mt-1 font-heading text-2xl font-bold">
                {activeStaff.length} active
              </div>
              <p className="mt-1 font-sans text-xs text-muted-foreground">
                {pendingStaff.length} pending invitations
              </p>
            </Card>
          </div>

          {/* Full Description & Logistics */}
          <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold">Event Description</h3>
            <p className="font-sans text-sm leading-relaxed text-foreground whitespace-pre-line">
              {event.description}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t pt-4 font-sans text-xs text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">Refund Policy: </span>
                {event.isRefundable ? "Refunds permitted by policy" : "Non-refundable event"}
              </div>
              <div>
                <span className="font-semibold text-foreground">Status: </span>
                <span className="capitalize">{event.status.toLowerCase().replace("_", " ")}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: TICKETS */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold">Ticket Tiers & Quota</h2>
              <p className="font-sans text-xs text-muted-foreground">
                Configure ticket pricing, capacities, and monitor availability.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setTierModalOpen(true)}
              className="gap-1.5 rounded-xl font-sans text-xs font-semibold"
            >
              <Plus className="size-3.5" /> Add Tier
            </Button>
          </div>

          {event.ticketTypes.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <Ticket className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 font-sans text-xs text-muted-foreground">
                No ticket tiers added yet. Add at least one tier to enable ticket sales.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
              <table className="w-full text-left font-sans text-xs">
                <thead className="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4">Tier Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Available</th>
                    <th className="p-4">Sold</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {event.ticketTypes.map((tier) => {
                    const sold = Math.max(0, tier.quota - tier.availableQuota);
                    return (
                      <tr key={tier.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-bold text-foreground">{tier.name}</td>
                        <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                          {Number(tier.price) === 0 ? "Free" : formatCurrency(Number(tier.price))}
                        </td>
                        <td className="p-4">{tier.quota}</td>
                        <td className="p-4 text-primary font-semibold">{tier.availableQuota}</td>
                        <td className="p-4">{sold}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() =>
                                setEditTierModal({
                                  open: true,
                                  id: tier.id,
                                  name: tier.name,
                                  price: tier.price.toString(),
                                  quota: tier.quota.toString(),
                                })
                              }
                            >
                              <Edit2 className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              disabled={sold > 0}
                              onClick={() => handleDeleteTicketTier(tier.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEAM */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-bold">Event Staff & Invitations</h2>
            <p className="font-sans text-xs text-muted-foreground">
              Users assigned to this specific event for on-site check-in and attendee ticket redemption.
            </p>
          </div>

          {/* Active Assigned Staff */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              Active Check-in Staff ({activeStaff.length})
            </h3>
            {activeStaff.length === 0 ? (
              <p className="font-sans text-xs text-muted-foreground rounded-xl border border-dashed p-4">
                No active staff members assigned yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 font-sans text-xs font-bold text-primary">
                        {staff.user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-sans text-xs font-bold text-foreground">{staff.user.fullName}</p>
                        <p className="font-sans text-[11px] text-muted-foreground">{staff.user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStaff(staff.id)}
                      className="h-8 rounded-lg text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Invitations */}
          {pendingStaff.length > 0 && (
            <div className="space-y-3 border-t pt-5">
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <Clock className="size-4 text-amber-500" />
                Pending Invitations ({pendingStaff.length})
              </h3>
              <p className="font-sans text-xs text-muted-foreground">
                These users will automatically become active staff when the administrator approves your event.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pendingStaff.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 shadow-xs"
                  >
                    <div>
                      <p className="font-sans text-xs font-bold text-foreground">{inv.user.fullName}</p>
                      <p className="font-sans text-[11px] text-muted-foreground">{inv.user.email}</p>
                    </div>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-sans text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                      Pending Approval
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CHECK-IN MONITOR */}
      {activeTab === "checkin" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold">Live Check-in Monitor</h2>
              <p className="font-sans text-xs text-muted-foreground">
                Track on-site attendee arrivals and live redemption progress for this event.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={loadCheckinData}
              disabled={loadingCheckin}
              className="gap-1.5 rounded-xl text-xs"
            >
              <RefreshCw className={`size-3.5 ${loadingCheckin ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>

          {loadingCheckin && !checkinData ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : checkinData ? (
            <>
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Card className="rounded-2xl border p-4 shadow-xs">
                  <span className="font-sans text-xs text-muted-foreground">Total Tickets</span>
                  <div className="mt-1 font-heading text-2xl font-bold">
                    {checkinData.statistics.totalParticipants}
                  </div>
                  <span className="font-sans text-[10px] text-muted-foreground">Paid orders</span>
                </Card>

                <Card className="rounded-2xl border p-4 shadow-xs">
                  <span className="font-sans text-xs text-muted-foreground">Checked-in</span>
                  <div className="mt-1 font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {checkinData.statistics.totalRedeemed}
                  </div>
                  <span className="font-sans text-[10px] text-muted-foreground">Attendees verified</span>
                </Card>

                <Card className="rounded-2xl border p-4 shadow-xs">
                  <span className="font-sans text-xs text-muted-foreground">Remaining</span>
                  <div className="mt-1 font-heading text-2xl font-bold">
                    {checkinData.statistics.remainingTickets}
                  </div>
                  <span className="font-sans text-[10px] text-muted-foreground">Yet to arrive</span>
                </Card>

                <Card className="rounded-2xl border p-4 shadow-xs">
                  <span className="font-sans text-xs text-muted-foreground">Arrival Rate</span>
                  <div className="mt-1 font-heading text-2xl font-bold text-primary">
                    {checkinData.statistics.redemptionRate}%
                  </div>
                  <span className="font-sans text-[10px] text-muted-foreground">Redeemed percentage</span>
                </Card>
              </div>

              {/* Recent Check-ins Table */}
              <div className="space-y-3">
                <h3 className="font-heading text-sm font-bold">Recent Arrivals</h3>
                {checkinData.recentRedemptions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-8 text-center">
                    <p className="font-sans text-xs text-muted-foreground">
                      No attendee tickets scanned yet for this event.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                    <table className="w-full text-left font-sans text-xs">
                      <thead className="border-b bg-muted/40 text-[11px] font-semibold uppercase text-muted-foreground">
                        <tr>
                          <th className="p-3">Ticket Code</th>
                          <th className="p-3">Attendee</th>
                          <th className="p-3">Tier</th>
                          <th className="p-3">Scanned Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {checkinData.recentRedemptions.map((red) => (
                          <tr key={red.id} className="hover:bg-muted/30">
                            <td className="p-3 font-mono font-bold text-primary">{red.ticketCode}</td>
                            <td className="p-3 font-semibold">{red.buyerName}</td>
                            <td className="p-3">{red.ticketType}</td>
                            <td className="p-3 text-muted-foreground">{formatDate(red.redeemedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed p-8 text-center">
              <p className="font-sans text-xs text-muted-foreground">
                Check-in metrics become active once the event is published and tickets are purchased.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-bold">Event Sales Analytics</h2>
            <p className="font-sans text-xs text-muted-foreground">
              Tier-by-tier sales breakdown and revenue contribution.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {event.ticketTypes.map((tier) => {
              const sold = Math.max(0, tier.quota - tier.availableQuota);
              const tierRevenue = sold * Number(tier.price);
              const percent = tier.quota > 0 ? Math.round((sold / tier.quota) * 100) : 0;

              return (
                <Card key={tier.id} className="rounded-2xl border p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-foreground">{tier.name}</h3>
                    <span className="font-heading text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(tierRevenue)}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-xs text-muted-foreground">
                    {formatCurrency(Number(tier.price))} per ticket
                  </p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between font-sans text-xs font-medium">
                      <span>Quota Filled</span>
                      <span>
                        {sold} / {tier.quota} ({percent}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Ticket Tier Dialog */}
      <Dialog open={tierModalOpen} onOpenChange={setTierModalOpen}>
        <DialogPopup className="max-w-md font-sans">
          <DialogTitle className="font-heading text-lg font-bold">Add Ticket Tier</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Create a new pricing tier or admission category for this event.
          </DialogDescription>
          <form onSubmit={handleCreateTicketTier} className="mt-4 space-y-4">
            <div>
              <Label className="text-xs font-semibold">Tier Name *</Label>
              <Input
                value={tierName}
                onChange={(e) => setTierName(e.target.value)}
                placeholder="e.g. VIP Pass, Early Bird"
                className="mt-1 h-10 rounded-xl text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Price (IDR) *</Label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={tierPrice}
                onChange={(e) => setTierPrice(e.target.value)}
                placeholder="0 for Free"
                className="mt-1 h-10 rounded-xl text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Quota (Total Available Tickets) *</Label>
              <Input
                type="number"
                min="1"
                value={tierQuota}
                onChange={(e) => setTierQuota(e.target.value)}
                placeholder="100"
                className="mt-1 h-10 rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <DialogClose render={<Button variant="outline" className="rounded-xl text-xs" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={savingTier} className="rounded-xl bg-primary text-xs font-semibold">
                {savingTier ? "Creating..." : "Create Tier"}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </Dialog>

      {/* Edit Ticket Tier Dialog */}
      <Dialog
        open={editTierModal.open}
        onOpenChange={(open) => setEditTierModal((prev) => ({ ...prev, open }))}
      >
        <DialogPopup className="max-w-md font-sans">
          <DialogTitle className="font-heading text-lg font-bold">Edit Ticket Tier</DialogTitle>
          <form onSubmit={handleUpdateTicketTier} className="mt-4 space-y-4">
            <div>
              <Label className="text-xs font-semibold">Tier Name *</Label>
              <Input
                value={editTierModal.name}
                onChange={(e) => setEditTierModal((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 h-10 rounded-xl text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Price (IDR) *</Label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={editTierModal.price}
                onChange={(e) => setEditTierModal((prev) => ({ ...prev, price: e.target.value }))}
                className="mt-1 h-10 rounded-xl text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Quota *</Label>
              <Input
                type="number"
                min="1"
                value={editTierModal.quota}
                onChange={(e) => setEditTierModal((prev) => ({ ...prev, quota: e.target.value }))}
                className="mt-1 h-10 rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <DialogClose render={<Button variant="outline" className="rounded-xl text-xs" />}>
                Cancel
              </DialogClose>
              <Button type="submit" className="rounded-xl bg-primary text-xs font-semibold">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogPopup>
      </Dialog>
    </div>
  );
}
