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
  Building2,
  User,
  CreditCard,
  FileText,
  AlertTriangle,
  ExternalLink,
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
  fetchAdminOrganizerDetail,
  approveOrganizer,
  rejectOrganizer,
  approveDocument,
  rejectDocument,
} from "@/components/admin/organizers/organizers-api";
import { AdminApiError } from "@/lib/admin-api";
import type {
  OrganizerProfile,
  OrganizerDocument,
} from "@/components/admin/organizers/organizers-types";

const documentTypeLabels: Record<string, string> = {
  BUSINESS_LICENSE: "Business License",
  GUARANTEE_LETTER: "Guarantee Letter",
  ORGANIZATION_REGISTRATION: "Organization Registration",
  IDENTITY_CARD: "Identity Card (KTP)",
};

export default function OrganizerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const organizerId = resolvedParams.id;
  const router = useRouter();

  const [organizer, setOrganizer] = useState<OrganizerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile actions
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Document actions
  const [selectedDoc, setSelectedDoc] = useState<OrganizerDocument | null>(null);
  const [docRejectDialogOpen, setDocRejectDialogOpen] = useState(false);
  const [docRejectionReason, setDocRejectionReason] = useState("");

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
        const data = await fetchAdminOrganizerDetail(organizerId);
        setOrganizer(data);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load application");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [organizerId, router]);

  async function handleApproveProfile() {
    setActionLoading(true);
    try {
      const res = await approveOrganizer(organizerId);
      toast.success(res.message);
      setOrganizer(res.organizer);
      setApproveDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRejectProfile() {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setActionLoading(true);
    try {
      const res = await rejectOrganizer(organizerId, rejectionReason.trim());
      toast.success(res.message);
      setOrganizer(res.organizer);
      setRejectDialogOpen(false);
      setRejectionReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApproveDoc(docId: string) {
    try {
      const res = await approveDocument(docId);
      toast.success(res.message);
      setOrganizer((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          documents: prev.documents.map((d) =>
            d.id === docId ? res.document : d
          ),
        };
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Document approval failed");
    }
  }

  async function handleRejectDoc() {
    if (!selectedDoc || !docRejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    try {
      const res = await rejectDocument(selectedDoc.id, docRejectionReason.trim());
      toast.success(res.message);
      setOrganizer((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          documents: prev.documents.map((d) =>
            d.id === selectedDoc.id ? res.document : d
          ),
        };
      });
      setDocRejectDialogOpen(false);
      setSelectedDoc(null);
      setDocRejectionReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Document rejection failed");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="size-8 text-destructive mb-2" />
        <p className="font-heading text-sm font-semibold">{error || "Organizer not found"}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const isPending = organizer.status === "PENDING";
  const allDocsApproved = organizer.documents.every((d) => d.status === "APPROVED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/organizers" />}
            className="size-8 p-0"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold">
                {organizer.organizationName}
              </h2>
              <StatusBadge status={organizer.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Applicant: {organizer.user?.fullName} ({organizer.user?.email})
            </p>
          </div>
        </div>

        {isPending && (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setApproveDialogOpen(true)}
              disabled={!allDocsApproved}
              className="gap-1.5"
            >
              <CheckCircle2 className="size-4" />
              <span>Approve Organizer</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setRejectDialogOpen(true)}
              className="gap-1.5"
            >
              <XCircle className="size-4" />
              <span>Reject Organizer</span>
            </Button>
          </div>
        )}
      </div>

      {!allDocsApproved && isPending && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-700 dark:text-amber-300">
          All documents must be reviewed and approved before approving this organizer application.
        </div>
      )}

      {organizer.rejectionReason && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="font-heading text-xs font-semibold text-destructive">
            Rejection Reason:
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {organizer.rejectionReason}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="size-4 text-primary" />
              <span>Organization Info</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{organizer.organizationName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{organizer.phoneNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium">{organizer.address}</p>
            </div>
            {organizer.identityCardNumber && (
              <div>
                <p className="text-muted-foreground">ID Card Number</p>
                <p className="font-mono">{organizer.identityCardNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applicant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <User className="size-4 text-primary" />
              <span>Applicant Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Full Name</p>
              <p className="font-medium">{organizer.user?.fullName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{organizer.user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email Verified</p>
              <p className="font-medium">
                {organizer.user?.emailVerified ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Role</p>
              <p className="font-medium">{organizer.user?.role || "USER"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Banking Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <CreditCard className="size-4 text-primary" />
              <span>Banking Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground">Bank Name</p>
              <p className="font-medium">{organizer.bankName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Account Number</p>
              <p className="font-mono font-medium">{organizer.bankAccountNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Account Holder</p>
              <p className="font-medium">{organizer.bankAccountName}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="size-4 text-primary" />
            <span>Submitted Documents ({organizer.documents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {organizer.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between rounded-xl border border-border p-4 space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold">
                        {documentTypeLabels[doc.type] || doc.type}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>

                  {doc.rejectionReason && (
                    <p className="mt-2 text-xs text-destructive">
                      Reason: {doc.rejectionReason}
                    </p>
                  )}

                  <div className="relative mt-3 h-40 w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={doc.fileUrl}
                      alt={doc.type}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <span>View Full Image</span>
                    <ExternalLink className="size-3" />
                  </a>

                  {isPending && doc.status === "PENDING" && (
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveDoc(doc.id)}
                        className="h-7 text-xs px-2 gap-1"
                      >
                        <CheckCircle2 className="size-3" />
                        <span>Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedDoc(doc);
                          setDocRejectDialogOpen(true);
                        }}
                        className="h-7 text-xs px-2 gap-1"
                      >
                        <XCircle className="size-3" />
                        <span>Reject</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approve Profile Dialog */}
      <ConfirmDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        title="Approve Organizer"
        description={`Are you sure you want to approve "${organizer.organizationName}"? This will allow them to create and manage events.`}
        confirmLabel="Approve"
        onConfirm={handleApproveProfile}
        loading={actionLoading}
      />

      {/* Reject Profile Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogPopup>
          <div className="flex flex-col gap-2">
            <DialogTitle>Reject Organizer Application</DialogTitle>
            <DialogDescription>
              Please provide a clear reason for rejecting this application.
            </DialogDescription>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs font-medium">Rejection Reason</label>
            <Input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete or forged documentation"
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
              onClick={handleRejectProfile}
              disabled={actionLoading || !rejectionReason.trim()}
            >
              {actionLoading ? "Rejecting..." : "Reject Application"}
            </Button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* Reject Document Dialog */}
      <Dialog open={docRejectDialogOpen} onOpenChange={setDocRejectDialogOpen}>
        <DialogPopup>
          <div className="flex flex-col gap-2">
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this document ({selectedDoc?.type}).
            </DialogDescription>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs font-medium">Rejection Reason</label>
            <Input
              value={docRejectionReason}
              onChange={(e) => setDocRejectionReason(e.target.value)}
              placeholder="e.g. Image blurry, document expired"
              required
            />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDocRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectDoc}
              disabled={!docRejectionReason.trim()}
            >
              Reject Document
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </div>
  );
}
