"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Ticket, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { PaginationControls } from "@/components/admin/shared/pagination-controls";
import { fetchAdminTickets } from "@/components/admin/tickets/tickets-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminTicket } from "@/components/admin/tickets/tickets-types";
import type { PaginationMeta } from "@/lib/admin-types";

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState<"ALL" | "REDEEMED" | "UNREDEEMED" | "CANCELLED">("ALL");
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
        const response = await fetchAdminTickets({
          page,
          limit: 10,
          search: search || undefined,
          isRedeemed:
            filterState === "REDEEMED"
              ? true
              : filterState === "UNREDEEMED"
              ? false
              : undefined,
          isCancelled: filterState === "CANCELLED" ? true : undefined,
        });
        setTickets(response.data);
        setMeta(response.meta);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    },
    [router, search, filterState]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  return (
    <div>
      <PageHeader
        title="Ticket Management"
        description="Inspect issued electronic tickets, redemption records, and ticket ownership (Read-Only)."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            placeholder="Search ticket code, order, buyer..."
            value={search}
            onChange={(val) => setSearch(val)}
          />
          <div className="flex gap-1">
            {(
              [
                { label: "All", value: "ALL" },
                { label: "Unredeemed", value: "UNREDEEMED" },
                { label: "Redeemed", value: "REDEEMED" },
                { label: "Cancelled", value: "CANCELLED" },
              ] as const
            ).map((f) => (
              <Button
                key={f.value}
                variant={filterState === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterState(f.value)}
                className="h-8 text-xs"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {meta.total} {meta.total === 1 ? "ticket" : "tickets"}
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
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Ticket className="size-8 text-muted-foreground mb-2" />
          <p className="font-heading text-sm font-semibold">No tickets found</p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {search || filterState !== "ALL"
              ? "No tickets match your filter criteria."
              : "No tickets have been issued yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Code</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((t) => {
                const eventTitle =
                  t.orderItem?.ticketType?.event?.title || "-";
                const typeName = t.orderItem?.ticketType?.name || "-";
                const buyerName =
                  t.orderItem?.order?.user?.fullName || "-";

                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      {t.ticketCode}
                    </TableCell>
                    <TableCell className="text-xs max-w-[180px] truncate">
                      {eventTitle}
                    </TableCell>
                    <TableCell className="text-xs">{typeName}</TableCell>
                    <TableCell className="text-xs">{buyerName}</TableCell>
                    <TableCell>
                      {t.isCancelled ? (
                        <Badge variant="destructive">Cancelled</Badge>
                      ) : t.isRedeemed ? (
                        <Badge variant="default">Redeemed</Badge>
                      ) : (
                        <Badge variant="outline">Unused</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/tickets/${t.id}`} />}
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
