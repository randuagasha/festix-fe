"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Building2, Eye, AlertCircle } from "lucide-react";
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
import { fetchAdminOrganizers } from "@/components/admin/organizers/organizers-api";
import { AdminApiError } from "@/lib/admin-api";
import type { OrganizerProfile, OrganizerStatus } from "@/components/admin/organizers/organizers-types";
import type { PaginationMeta } from "@/lib/admin-types";

const statusFilters: { label: string; value: OrganizerStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function OrganizersPage() {
  const router = useRouter();
  const [organizers, setOrganizers] = useState<OrganizerProfile[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrganizerStatus | "ALL">("ALL");
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
        const response = await fetchAdminOrganizers({
          page,
          limit: 10,
          search: search || undefined,
          status: selectedStatus === "ALL" ? undefined : selectedStatus,
        });
        setOrganizers(response.data);
        setMeta(response.meta);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load organizers");
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
        title="Organizer Applications"
        description="Review identity, organization information, and documents submitted by aspiring organizers."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            placeholder="Search by organization or applicant..."
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
          {meta.total} {meta.total === 1 ? "application" : "applications"}
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
      ) : organizers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Building2 className="size-8 text-muted-foreground mb-2" />
          <p className="font-heading text-sm font-semibold">No applications found</p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {search || selectedStatus !== "ALL"
              ? "No applications match your filter."
              : "No organizer applications have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizers.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <p className="font-medium">{org.organizationName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {org.address}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-medium">{org.user?.fullName || "-"}</p>
                    <p className="text-[11px] text-muted-foreground">{org.user?.email}</p>
                  </TableCell>
                  <TableCell className="text-xs">{org.phoneNumber}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={org.status} />
                  </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/organizers/${org.id}`} />}
                        className="size-8 p-0"
                      >
                      <Eye className="size-4 text-muted-foreground" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
