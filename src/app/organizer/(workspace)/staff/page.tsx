"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { organizerFetch, type OrganizerStaffItem } from "@/lib/organizer-api";

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

export default function OrganizerStaffPage() {
  const [activeStaff, setActiveStaff] = useState<OrganizerStaffItem[]>([]);
  const [pendingStaff, setPendingStaff] = useState<OrganizerStaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<"ALL" | "ACTIVE" | "PENDING">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  async function loadStaff() {
    setLoading(true);
    setError(null);
    try {
      const res: any = await organizerFetch("/organizer/staff");
      setActiveStaff(res.active || []);
      setPendingStaff(res.pending || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load staff roster");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  const allItems = [...activeStaff, ...pendingStaff];

  const filteredItems = allItems.filter((item) => {
    if (activeFilter === "ACTIVE" && item.type !== "ACTIVE") return false;
    if (activeFilter === "PENDING" && item.type !== "PENDING") return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.fullName.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchEvent = item.eventTitle.toLowerCase().includes(q);
      return matchName || matchEmail || matchEvent;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Staff & Invitations Roster
          </h1>
          <p className="font-sans text-xs text-muted-foreground sm:text-sm">
            Overview of team assignments and pending invitations across all your events.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadStaff}
          disabled={loading}
          className="gap-1.5 rounded-xl font-sans text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Info Notice on Lifecycle */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs font-sans text-foreground">
        <Sparkles className="size-5 shrink-0 text-primary" />
        <div>
          <span className="font-semibold text-primary">Event-Specific Access: </span>
          Staff assignments strictly authorize check-in redemption only for the assigned event. Invitations remain pending until the respective event receives administrator approval.
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <div>
            <p className="font-sans text-xs text-muted-foreground">Total Roster</p>
            <p className="font-heading text-xl font-bold text-foreground">{allItems.length} crew</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="font-sans text-xs text-muted-foreground">Active Staff</p>
            <p className="font-heading text-xl font-bold text-foreground">{activeStaff.length} ready</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="font-sans text-xs text-muted-foreground">Pending Activation</p>
            <p className="font-heading text-xl font-bold text-foreground">{pendingStaff.length} awaiting</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1">
          {[
            { id: "ALL", label: `All (${allItems.length})` },
            { id: "ACTIVE", label: `Active (${activeStaff.length})` },
            { id: "PENDING", label: `Pending (${pendingStaff.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or event..."
            className="h-9 rounded-xl pl-8 pr-3 font-sans text-xs"
          />
        </div>
      </div>

      {/* Staff List Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertCircle className="mx-auto size-8 text-destructive" />
          <p className="mt-2 font-heading text-sm font-semibold">{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <Users className="mx-auto size-10 text-muted-foreground/60" />
          <h3 className="mt-3 font-heading text-base font-semibold">No crew members found</h3>
          <p className="mt-1 font-sans text-xs text-muted-foreground">
            {searchTerm || activeFilter !== "ALL"
              ? "Try adjusting your search or status filter."
              : "Invite team members when creating an event or managing existing events."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full text-left font-sans text-xs">
            <thead className="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">Crew Member</th>
                <th className="p-4">Assigned Event</th>
                <th className="p-4">Event Status</th>
                <th className="p-4">Staff Status</th>
                <th className="p-4">Invited / Assigned</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-sans text-xs font-bold text-primary">
                        {item.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.fullName}</p>
                        <p className="font-sans text-[11px] text-muted-foreground">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-foreground">
                    <span className="truncate max-w-[200px] block">{item.eventTitle}</span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-muted px-2 py-0.5 font-sans text-[10px] font-semibold text-muted-foreground uppercase">
                      {item.eventStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.type === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" /> Active Crew
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                        <Clock className="size-3" /> Pending Approval
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(item.createdAt)}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/organizer/events/${item.eventId}`}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                    >
                      <span>Event</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
