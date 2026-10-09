"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Receipt, Eye, AlertCircle } from "lucide-react";
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
import { fetchAdminOrders } from "@/components/admin/orders/orders-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminOrder, PaymentStatus } from "@/components/admin/orders/orders-types";
import type { PaginationMeta } from "@/lib/admin-types";

const statusFilters: { label: string; value: PaymentStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Failed", value: "FAILED" },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "ALL">("ALL");
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
        const response = await fetchAdminOrders({
          page,
          limit: 10,
          search: search || undefined,
          status: selectedStatus === "ALL" ? undefined : selectedStatus,
        });
        setOrders(response.data);
        setMeta(response.meta);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load orders");
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
        title="Orders & Transactions"
        description="Inspect platform purchases, payment gateway status, and ticket sales records (Read-Only)."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            placeholder="Search order number, customer..."
            value={search}
            onChange={(val) => setSearch(val)}
          />
          <div className="flex gap-1">
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
          {meta.total} {meta.total === 1 ? "order" : "orders"}
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
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Receipt className="size-8 text-muted-foreground mb-2" />
          <p className="font-heading text-sm font-semibold">No orders found</p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {search || selectedStatus !== "ALL"
              ? "No orders match your filter criteria."
              : "No orders have been placed yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const eventTitle =
                  order.orderItems?.[0]?.ticketType?.event?.title || "-";

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-medium">{order.user?.fullName || "-"}</p>
                      <p className="text-[11px] text-muted-foreground">{order.user?.email}</p>
                    </TableCell>
                    <TableCell className="text-xs max-w-[180px] truncate">
                      {eventTitle}
                    </TableCell>
                    <TableCell className="font-heading text-xs font-semibold text-primary">
                      Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/orders/${order.id}`} />}
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
