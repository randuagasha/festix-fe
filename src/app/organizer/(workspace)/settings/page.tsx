"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  ShieldCheck,
  CreditCard,
  FileText,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { organizerFetch } from "@/lib/organizer-api";

interface OrganizerProfileData {
  id: string;
  organizationName: string;
  phoneNumber: string;
  address: string;
  identityCardNumber?: string | null;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents?: {
    id: string;
    type: string;
    status: string;
    fileUrl: string;
  }[];
}

const docLabels: Record<string, string> = {
  BUSINESS_LICENSE: "Business License (SIUP / NIB)",
  GUARANTEE_LETTER: "Letter of Guarantee",
  ORGANIZATION_REGISTRATION: "Organization Registration Deed",
  IDENTITY_CARD: "Identity Card (KTP)",
};

export default function OrganizerSettingsPage() {
  const [profile, setProfile] = useState<OrganizerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      const data: any = await organizerFetch("/organizer/me");
      setProfile(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load organizer profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mx-auto size-10 text-destructive" />
        <h2 className="mt-2 font-heading text-lg font-bold">Failed to load organization settings</h2>
        <p className="mt-1 font-sans text-xs text-muted-foreground">{error}</p>
        <Button onClick={loadProfile} variant="outline" className="mt-4 gap-2 rounded-xl text-xs">
          <RefreshCw className="size-3.5" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7 pb-16">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Organization Settings
        </h1>
        <p className="font-sans text-xs text-muted-foreground sm:text-sm">
          Verified company details, banking destination, and approved credentials.
        </p>
      </div>

      {/* Verification Status Banner */}
      <div className="flex items-center justify-between rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                {profile.organizationName}
              </h2>
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 font-sans text-[11px] font-bold text-white uppercase">
                Verified
              </span>
            </div>
            <p className="font-sans text-xs text-muted-foreground">
              Official Tixora event organizer account • Approved & in good standing
            </p>
          </div>
        </div>
      </div>

      {/* Organization Details Card */}
      <Card className="rounded-2xl border border-border bg-card shadow-xs">
        <CardHeader className="border-b pb-4">
          <CardTitle className="font-heading text-base font-bold flex items-center gap-2">
            <Building2 className="size-4.5 text-primary" />
            <span>Organization Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 font-sans text-xs">
            <div>
              <span className="font-semibold text-muted-foreground">Legal Organization Name</span>
              <p className="mt-1 font-heading text-sm font-bold text-foreground">
                {profile.organizationName}
              </p>
            </div>

            <div>
              <span className="font-semibold text-muted-foreground">Contact Phone</span>
              <p className="mt-1 text-sm text-foreground flex items-center gap-1.5">
                <Phone className="size-3.5 text-primary" /> {profile.phoneNumber}
              </p>
            </div>

            <div className="sm:col-span-2">
              <span className="font-semibold text-muted-foreground">Registered Address</span>
              <p className="mt-1 text-sm text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary shrink-0" /> {profile.address}
              </p>
            </div>

            {profile.identityCardNumber && (
              <div>
                <span className="font-semibold text-muted-foreground">KTP / Identity Card Number</span>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {profile.identityCardNumber}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Banking & Payout Destination Card */}
      <Card className="rounded-2xl border border-border bg-card shadow-xs">
        <CardHeader className="border-b pb-4">
          <CardTitle className="font-heading text-base font-bold flex items-center gap-2">
            <CreditCard className="size-4.5 text-primary" />
            <span>Banking & Payout Destination</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 font-sans text-xs">
            <div>
              <span className="font-semibold text-muted-foreground">Bank Name</span>
              <p className="mt-1 text-sm font-bold text-foreground">{profile.bankName}</p>
            </div>

            <div>
              <span className="font-semibold text-muted-foreground">Account Number</span>
              <p className="mt-1 font-mono text-sm font-bold text-primary">{profile.bankAccountNumber}</p>
            </div>

            <div>
              <span className="font-semibold text-muted-foreground">Beneficiary Name</span>
              <p className="mt-1 text-sm font-bold text-foreground">{profile.bankAccountName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verified Documents Card */}
      {profile.documents && profile.documents.length > 0 && (
        <Card className="rounded-2xl border border-border bg-card shadow-xs">
          <CardHeader className="border-b pb-4">
            <CardTitle className="font-heading text-base font-bold flex items-center gap-2">
              <FileText className="size-4.5 text-primary" />
              <span>Approved Verification Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="divide-y divide-border/60">
              {profile.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-3 font-sans text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-foreground">
                        {docLabels[doc.type] || doc.type}
                      </p>
                      <span className="font-sans text-[10px] text-muted-foreground">
                        Status: Approved
                      </span>
                    </div>
                  </div>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <span>View File</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support / Change Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4 font-sans text-xs text-muted-foreground">
        <HelpCircle className="size-4.5 shrink-0 text-primary" />
        <p>
          Need to change your legal organization name, banking destination, or legal representative?{" "}
          <span className="text-foreground font-semibold">
            Contact Festix Support to request changes to verified business records.
          </span>
        </p>
      </div>
    </div>
  );
}
