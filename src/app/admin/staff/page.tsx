"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Shield, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { fetchAdminStaff } from "@/components/admin/staff/staff-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminStaffUser } from "@/components/admin/staff/staff-types";
import type { PaginationMeta } from "@/lib/admin-types";

export default function StaffPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<AdminStaffUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
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
        const response = await fetchAdminStaff({
          page,
          limit: 10,
          search: search || undefined,
        });
        setStaffList(response.data);
        setMeta(response.meta);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load staff list");
      } finally {
        setLoading(false);
      }
    },
    [router, search]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  return (
    <div>
      <PageHeader
        title="Staff & Access Management"
        description="Manage event staff accounts and event-specific ticket scanner assignments."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search staff by name or email..."
          value={search}
          onChange={(val) => setSearch(val)}
        />
        <span className="text-xs text-muted-foreground">
          {meta.total} {meta.total === 1 ? "staff member" : "staff members"}
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
      ) : staffList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Shield className="size-8 text-muted-foreground mb-2" />
          <p className="font-heading text-sm font-semibold">No staff found</p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {search
              ? "No staff match your search criteria."
              : "No users currently hold the STAFF role. Change user roles in User Management."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Assigned Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((staff) => {
                const initial = staff.fullName?.charAt(0).toUpperCase() || "S";

                return (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm" className="size-8">
                          {staff.avatar && (
                            <AvatarImage src={staff.avatar} alt={staff.fullName} />
                          )}
                          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-xs">{staff.fullName}</p>
                          <p className="text-[11px] text-muted-foreground">{staff.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {staff._count?.assignedEvents ?? 0} events
                      </span>
                    </TableCell>
                    <TableCell>
                      {staff.isSuspended ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(staff.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/staff/${staff.id}`} />}
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
