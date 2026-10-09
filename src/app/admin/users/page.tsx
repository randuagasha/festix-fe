"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { Users, Eye, AlertCircle } from "lucide-react";
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
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { PaginationControls } from "@/components/admin/shared/pagination-controls";
import { fetchAdminUsers } from "@/components/admin/users/users-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminUser, Role } from "@/components/admin/users/users-types";
import type { PaginationMeta } from "@/lib/admin-types";

const roleFilters: { label: string; value: Role | "ALL" }[] = [
  { label: "All Roles", value: "ALL" },
  { label: "User", value: "USER" },
  { label: "Staff", value: "STAFF" },
  { label: "Admin", value: "ADMIN" },
];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | "ALL">("ALL");
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
        const response = await fetchAdminUsers({
          page,
          limit: 10,
          search: search || undefined,
          role: selectedRole === "ALL" ? undefined : selectedRole,
        });
        setUsers(response.data);
        setMeta(response.meta);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    },
    [router, search, selectedRole]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  return (
    <div>
      <PageHeader
        title="User Management"
        description="View accounts, assign roles, manage platform access and account status."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            placeholder="Search by name or email..."
            value={search}
            onChange={(val) => setSearch(val)}
          />
          <div className="flex gap-1">
            {roleFilters.map((rf) => (
              <Button
                key={rf.value}
                variant={selectedRole === rf.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(rf.value)}
                className="h-8 text-xs"
              >
                {rf.label}
              </Button>
            ))}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {meta.total} {meta.total === 1 ? "user" : "users"}
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
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Users className="size-8 text-muted-foreground mb-2" />
          <p className="font-heading text-sm font-semibold">No users found</p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {search || selectedRole !== "ALL"
              ? "No users match your filter criteria."
              : "No registered users in the platform."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const initial = u.fullName?.charAt(0).toUpperCase() || "U";

                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm" className="size-8">
                          {u.avatar && <AvatarImage src={u.avatar} alt={u.fullName} />}
                          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-xs">{u.fullName}</p>
                          <p className="text-[11px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.role} />
                    </TableCell>
                    <TableCell>
                      {u.isSuspended ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {u.emailVerified ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/users/${u.id}`} />}
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
