"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  ArrowLeft,
  Shield,
  Ban,
  CheckCircle,
  Calendar,
  Receipt,
  UserCheck,
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
  fetchAdminUserDetail,
  changeUserRole,
  suspendUser,
  unsuspendUser,
} from "@/components/admin/users/users-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminUser, Role } from "@/components/admin/users/users-types";

const rolesList: { label: string; value: Role; description: string }[] = [
  { label: "USER", value: "USER", description: "Standard user. Can browse and buy tickets." },
  { label: "STAFF", value: "STAFF", description: "Event staff. Can scan and redeem tickets for assigned events." },
  { label: "ADMIN", value: "ADMIN", description: "Platform administrator with full administrative access." },
];

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const router = useRouter();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Role dialog
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("USER");

  // Suspend dialog
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  // Unsuspend dialog
  const [unsuspendDialogOpen, setUnsuspendDialogOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

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
        const data = await fetchAdminUserDetail(userId);
        setUser(data);
        setSelectedRole(data.role);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId, router]);

  async function handleRoleChange() {
    if (!user || user.role === selectedRole) return;

    setActionLoading(true);
    try {
      const res = await changeUserRole(userId, selectedRole);
      toast.success(res.message);
      setUser((prev) => (prev ? { ...prev, role: res.user.role } : null));
      setRoleDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change role");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSuspend() {
    if (!suspendReason.trim()) {
      toast.error("Reason is required");
      return;
    }

    setActionLoading(true);
    try {
      const res = await suspendUser(userId, suspendReason.trim());
      toast.success(res.message);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              isSuspended: true,
              suspendReason: res.user.suspendReason,
              suspendedAt: res.user.suspendedAt,
            }
          : null
      );
      setSuspendDialogOpen(false);
      setSuspendReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to suspend user");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnsuspend() {
    setActionLoading(true);
    try {
      const res = await unsuspendUser(userId);
      toast.success(res.message);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              isSuspended: false,
              suspendReason: null,
              suspendedAt: null,
            }
          : null
      );
      setUnsuspendDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unsuspend user");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="size-8 text-destructive mb-2" />
        <p className="font-heading text-sm font-semibold">{error || "User not found"}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const initial = user.fullName?.charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/users" />}
            className="size-8 p-0"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold">{user.fullName}</h2>
              <StatusBadge status={user.role} />
              {user.isSuspended ? (
                <Badge variant="destructive">Suspended</Badge>
              ) : (
                <Badge variant="outline">Active</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRoleDialogOpen(true)}
            className="gap-1.5"
          >
            <Shield className="size-4" />
            <span>Change Role</span>
          </Button>

          {user.isSuspended ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setUnsuspendDialogOpen(true)}
              className="gap-1.5"
            >
              <CheckCircle className="size-4" />
              <span>Unsuspend</span>
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setSuspendDialogOpen(true)}
              disabled={user.role === "ADMIN"}
              className="gap-1.5"
            >
              <Ban className="size-4" />
              <span>Suspend</span>
            </Button>
          )}
        </div>
      </div>

      {user.isSuspended && user.suspendReason && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="font-heading text-xs font-semibold text-destructive">
            Suspension Reason:
          </p>
          <p className="text-xs text-muted-foreground mt-1">{user.suspendReason}</p>
          {user.suspendedAt && (
            <p className="text-[11px] text-muted-foreground/80 mt-1">
              Suspended on: {new Date(user.suspendedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Account Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="size-14">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.fullName} />}
                <AvatarFallback className="bg-primary/10 font-heading text-lg font-bold text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-[11px] truncate max-w-[150px]">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Verified</span>
                <span className="font-medium">{user.emailVerified ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joined Date</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Organizer Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {user.organizerProfile ? (
              <>
                <div>
                  <p className="text-muted-foreground">Organization</p>
                  <p className="font-medium">{user.organizerProfile.organizationName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={user.organizerProfile.status} />
                </div>
                {user.organizerProfile.phoneNumber && (
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.organizerProfile.phoneNumber}</p>
                  </div>
                )}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/admin/organizers/${user.organizerProfile.id}`} />}
                    className="w-full text-xs"
                  >
                    View Application
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No organizer profile registered.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Activity Counts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="size-4 text-primary" />
                <span>Events Created</span>
              </div>
              <span className="font-heading text-sm font-bold">
                {user._count?.events ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Receipt className="size-4 text-primary" />
                <span>Orders Placed</span>
              </div>
              <span className="font-heading text-sm font-bold">
                {user._count?.orders ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <UserCheck className="size-4 text-primary" />
                <span>Staff Assignments</span>
              </div>
              <span className="font-heading text-sm font-bold">
                {user._count?.assignedEvents ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogPopup>
          <div className="flex flex-col gap-2">
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Assign a new system role for {user.fullName}. Role changes take effect immediately across all sessions.
            </DialogDescription>
          </div>

          <div className="mt-4 space-y-2">
            {rolesList.map((r) => (
              <div
                key={r.value}
                onClick={() => setSelectedRole(r.value)}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  selectedRole === r.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{r.label}</span>
                  {selectedRole === r.value && (
                    <span className="text-xs font-semibold text-primary">Selected</span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{r.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setRoleDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleChange}
              disabled={actionLoading || selectedRole === user.role}
            >
              {actionLoading ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogPopup>
          <div className="flex flex-col gap-2">
            <DialogTitle>Suspend User Account</DialogTitle>
            <DialogDescription>
              Suspending an account revokes access to all protected endpoints immediately and blocks further logins.
            </DialogDescription>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs font-medium">Reason for Suspension</label>
            <Input
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="e.g. Terms violation, suspicious activity"
              required
            />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setSuspendDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={actionLoading || !suspendReason.trim()}
            >
              {actionLoading ? "Suspending..." : "Suspend User"}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* Unsuspend Confirm Dialog */}
      <ConfirmDialog
        open={unsuspendDialogOpen}
        onOpenChange={setUnsuspendDialogOpen}
        title="Unsuspend User Account"
        description={`Are you sure you want to reactivate the account for ${user.fullName}? They will regain full access according to their role.`}
        confirmLabel="Reactivate Account"
        onConfirm={handleUnsuspend}
        loading={actionLoading}
      />
    </div>
  );
}
