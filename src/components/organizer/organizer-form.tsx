"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { API_URL } from "../../../api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  Loader2,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  CreditCard,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

type OrganizerStatus = "PENDING" | "APPROVED" | "REJECTED";

interface OrganizerProfile {
  id: string;
  organizationName: string;
  phoneNumber: string;
  address: string;
  identityCardNumber: string | null;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  status: OrganizerStatus;
  rejectionReason: string | null;
}

interface FormData {
  organizationName: string;
  phoneNumber: string;
  address: string;
  identityCardNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

interface DocumentFiles {
  businessLicense: File | null;
  guaranteeLetter: File | null;
  organizationRegistration: File | null;
  identityCard: File | null;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const DOCUMENT_LABELS: Record<
  keyof DocumentFiles,
  { title: string; desc: string }
> = {
  businessLicense: {
    title: "Business License (SIUP / NIB)",
    desc: "Official business registration or operation license.",
  },
  guaranteeLetter: {
    title: "Guarantee Letter",
    desc: "Signed statement of event organizational responsibility.",
  },
  organizationRegistration: {
    title: "Organization Registration",
    desc: "Legal proof of organization or community establishment.",
  },
  identityCard: {
    title: "Identity Card (KTP)",
    desc: "Valid national identity card of the responsible person.",
  },
};

export function OrganizerForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [existingProfile, setExistingProfile] =
    useState<OrganizerProfile | null>(null);

  const [formData, setFormData] = useState<FormData>({
    organizationName: "",
    phoneNumber: "",
    address: "",
    identityCardNumber: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });

  const [files, setFiles] = useState<DocumentFiles>({
    businessLicense: null,
    guaranteeLetter: null,
    organizationRegistration: null,
    identityCard: null,
  });

  useEffect(() => {
    async function fetchStatus() {
      const token = Cookies.get("token");

      if (!token) {
        setIsFetching(false);
        router.push("/auth/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/organizer/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data: OrganizerProfile = await response.json();
          setExistingProfile(data);

          if (data.status === "REJECTED") {
            setFormData({
              organizationName: data.organizationName,
              phoneNumber: data.phoneNumber,
              address: data.address,
              identityCardNumber: data.identityCardNumber ?? "",
              bankName: data.bankName,
              bankAccountNumber: data.bankAccountNumber,
              bankAccountName: data.bankAccountName,
            });
          }
        }
      } catch {
        // 404 = no profile, show form
      } finally {
        setIsFetching(false);
      }
    }

    fetchStatus();
  }, [router]);

  function handleInputChange({ name, value }: { name: string; value: string }) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(key: keyof DocumentFiles, file: File | null) {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(
        `${DOCUMENT_LABELS[key].title}: Only JPG, PNG, or WebP allowed`,
        {
          position: "top-center",
        },
      );
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error(`${DOCUMENT_LABELS[key].title}: File exceeds 5 MB`, {
        position: "top-center",
      });
      return;
    }

    setFiles((prev) => ({ ...prev, [key]: file }));
  }

  async function handleSubmit() {
    if (
      !formData.organizationName ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.identityCardNumber ||
      !formData.bankName ||
      !formData.bankAccountNumber ||
      !formData.bankAccountName
    ) {
      toast.error("Please fill in all fields", { position: "top-center" });
      return;
    }

    if (formData.address.length < 10) {
      toast.error("Address must be at least 10 characters", {
        position: "top-center",
      });
      return;
    }

    if (!/^\d{16}$/.test(formData.identityCardNumber)) {
      toast.error("Identity card number must be exactly 16 digits", {
        position: "top-center",
      });
      return;
    }

    const missingFiles = (
      Object.keys(DOCUMENT_LABELS) as (keyof DocumentFiles)[]
    ).filter((key) => !files[key]);

    if (missingFiles.length > 0) {
      toast.error(
        `Please upload: ${missingFiles
          .map((k) => DOCUMENT_LABELS[k].title)
          .join(", ")}`,
        { position: "top-center" },
      );
      return;
    }

    setIsLoading(true);

    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Please login first", { position: "top-center" });
        router.push("/auth/login");
        return;
      }

      const body = new FormData();

      body.append("organizationName", formData.organizationName);
      body.append("phoneNumber", formData.phoneNumber);
      body.append("address", formData.address);
      body.append("identityCardNumber", formData.identityCardNumber);
      body.append("bankName", formData.bankName);
      body.append("bankAccountNumber", formData.bankAccountNumber);
      body.append("bankAccountName", formData.bankAccountName);

      body.append("businessLicense", files.businessLicense!);
      body.append("guaranteeLetter", files.guaranteeLetter!);
      body.append("organizationRegistration", files.organizationRegistration!);
      body.append("identityCard", files.identityCard!);

      const response = await fetch(`${API_URL}/organizer/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to submit application", {
          position: "top-center",
        });
        return;
      }

      toast.success("Organizer application submitted successfully", {
        position: "top-center",
      });

      router.push("/profile");
    } catch {
      toast.error("Failed to submit application. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className={cn("flex items-center justify-center py-28", className)}>
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (existingProfile?.status === "PENDING") {
    return (
      <div
        className={cn(
          "mx-auto flex w-full max-w-xl flex-col items-center px-6 py-20 text-center",
          className,
        )}>
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border bg-muted/40 shadow-sm">
          <Clock className="size-7 text-amber-500" />
        </div>

        <span className="mb-2 font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Organizer Application
        </span>

        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Application under review
        </h2>

        <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
          Your application has been submitted successfully. Our team is
          currently reviewing your information and documents.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full border bg-amber-500/10 px-4 py-1.5 font-sans text-xs font-medium text-amber-700 dark:text-amber-400">
          <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          Pending review
        </div>

        <Button
          variant="outline"
          className="mt-8 rounded-xl font-sans"
          onClick={() => router.push("/profile")}>
          Back to Profile
        </Button>
      </div>
    );
  }

  if (existingProfile?.status === "APPROVED") {
    return (
      <div
        className={cn(
          "mx-auto flex w-full max-w-xl flex-col items-center px-6 py-20 text-center",
          className,
        )}>
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border bg-emerald-500/10 shadow-sm">
          <CheckCircle2 className="size-7 text-emerald-600" />
        </div>

        <span className="mb-2 font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Organizer Application
        </span>

        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          You're an approved organizer
        </h2>

        <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
          Your application has been approved. You can now create and manage
          events on Festix.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 font-sans text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" />
          Application approved
        </div>

        <Button
          variant="outline"
          className="mt-8 rounded-xl font-sans"
          onClick={() => router.push("/profile")}>
          Back to Profile
        </Button>
      </div>
    );
  }

  const isResubmission = existingProfile?.status === "REJECTED";

  return (
    <div
      className={cn("w-full px-4 py-8 md:px-8 md:py-12", className)}
      {...props}>
      {/* Container utama diperluas ke max-w-5xl supaya pas di layar dan tidak terlalu menyempit */}
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Header Section */}
        <div className="border-b pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Building2 className="size-4 text-primary" />
                <span>Organizer Verification</span>
              </div>

              <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {isResubmission
                  ? "Update your application"
                  : "Become an organizer"}
              </h1>

              <p className="font-sans text-sm md:text-base leading-relaxed text-muted-foreground">
                {isResubmission
                  ? "Review your previous application, make the necessary changes, and submit it again."
                  : "Tell us about your organization and provide the required documents to start hosting events on Festix."}
              </p>
            </div>

            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border bg-muted/40 px-3.5 py-1.5 font-sans text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Secure Verification</span>
            </div>
          </div>
        </div>

        {/* Rejection Alert */}
        {isResubmission && (
          <div className="flex gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

            <div className="min-w-0 space-y-1">
              <p className="font-sans text-sm font-semibold text-destructive">
                Previous application rejected
              </p>

              {existingProfile.rejectionReason && (
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {existingProfile.rejectionReason}
                </p>
              )}

              <p className="font-sans text-xs text-muted-foreground">
                Please update the required fields below and resubmit.
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-8">
          {/* Section 1: Organization Details */}
          <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4 md:px-8">
              <h3 className="font-heading text-base md:text-lg font-semibold">
                Organization Details
              </h3>
              <p className="font-sans text-xs md:text-sm text-muted-foreground">
                Basic details about your organization or business entity.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <FieldGroup className="gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field>
                    <FieldLabel
                      className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      htmlFor="organizationName">
                      Organization Name
                    </FieldLabel>

                    <Input
                      className="mt-2 h-11 rounded-xl font-sans text-sm px-4"
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      placeholder="e.g. PT Event Studio"
                      required
                      onChange={(e) => handleInputChange(e.target)}
                      value={formData.organizationName}
                    />
                  </Field>

                  <Field>
                    <FieldLabel
                      className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      htmlFor="phoneNumber">
                      Phone Number
                    </FieldLabel>

                    <Input
                      className="mt-2 h-11 rounded-xl font-sans text-sm px-4"
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      placeholder="e.g. 081234567890"
                      required
                      onChange={(e) => handleInputChange(e.target)}
                      value={formData.phoneNumber}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel
                    className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    htmlFor="address">
                    Address
                  </FieldLabel>

                  <Input
                    className="mt-2 h-11 rounded-xl font-sans text-sm px-4"
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Full street address, city, and postal code"
                    required
                    onChange={(e) => handleInputChange(e.target)}
                    value={formData.address}
                  />

                  <FieldDescription className="mt-1.5 font-sans text-xs">
                    Minimum 10 characters.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel
                    className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    htmlFor="identityCardNumber">
                    Identity Card Number (NIK KTP)
                  </FieldLabel>

                  <Input
                    className="mt-2 h-11 rounded-xl font-sans text-sm px-4"
                    id="identityCardNumber"
                    name="identityCardNumber"
                    type="text"
                    inputMode="numeric"
                    placeholder="16-digit KTP number"
                    required
                    maxLength={16}
                    onChange={(e) => handleInputChange(e.target)}
                    value={formData.identityCardNumber}
                  />

                  <FieldDescription className="mt-1.5 font-sans text-xs">
                    Enter exactly 16 numeric digits.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </div>
          </section>

          {/* Section 2: Banking Information */}
          <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4 md:px-8">
              <h3 className="font-heading text-base md:text-lg font-semibold">
                Banking Information
              </h3>
              <p className="font-sans text-xs md:text-sm text-muted-foreground">
                Bank details used for payout settlements.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <FieldGroup className="gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field>
                    <FieldLabel
                      className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      htmlFor="bankName">
                      Bank Name
                    </FieldLabel>

                    <Input
                      className="mt-2 h-11 rounded-xl font-sans text-sm px-4"
                      id="bankName"
                      name="bankName"
                      type="text"
                      placeholder="e.g. BCA, Mandiri, BNI"
                      required
                      onChange={(e) => handleInputChange(e.target)}
                      value={formData.bankName}
                    />
                  </Field>

                  <Field>
                    <FieldLabel
                      className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      htmlFor="bankAccountNumber">
                      Bank Account Number
                    </FieldLabel>

                    <Input
                      className="mt-2 h-11 rounded-xl font-sans text-sm px-4"
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      type="text"
                      placeholder="e.g. 1234567890"
                      required
                      onChange={(e) => handleInputChange(e.target)}
                      value={formData.bankAccountNumber}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel
                    className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    htmlFor="bankAccountName">
                    Bank Account Holder Name
                  </FieldLabel>

                  <Input
                    className="mt-2 h-11 rounded-xl font-sans text-sm px-4"
                    id="bankAccountName"
                    name="bankAccountName"
                    type="text"
                    placeholder="Name exactly as registered on bank account"
                    required
                    onChange={(e) => handleInputChange(e.target)}
                    value={formData.bankAccountName}
                  />
                </Field>
              </FieldGroup>
            </div>
          </section>

          {/* Section 3: Required Documents */}
          <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4 md:px-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-base md:text-lg font-semibold">
                  Required Documents
                </h3>
                <p className="font-sans text-xs md:text-sm text-muted-foreground">
                  Upload clear image files of all required documentation.
                </p>
              </div>

              <div className="font-sans text-xs text-muted-foreground">
                JPG, PNG, or WebP &bull; Max 5MB
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Layout grid disesuaikan: 1 kolom di layar menengah/besar agar teks dokumen panjang muat tanpa kepotong */}
              <div className="grid gap-4 md:grid-cols-2">
                {(Object.keys(DOCUMENT_LABELS) as (keyof DocumentFiles)[]).map(
                  (key) => {
                    const file = files[key];
                    const docInfo = DOCUMENT_LABELS[key];

                    return (
                      <div
                        key={key}
                        className={cn(
                          "group flex flex-col justify-between gap-4 rounded-xl border p-5 transition-all sm:flex-row sm:items-center",
                          file
                            ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                            : "bg-muted/10 hover:border-muted-foreground/30 hover:bg-muted/20",
                        )}>
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div
                            className={cn(
                              "flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
                              file
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                                : "border-border bg-background text-muted-foreground",
                            )}>
                            {file ? (
                              <CheckCircle2 className="size-5" />
                            ) : (
                              <FileText className="size-5" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="font-sans text-sm font-semibold leading-tight text-foreground">
                              {docInfo.title}
                            </p>
                            <p className="font-sans text-xs text-muted-foreground line-clamp-1">
                              {file ? (
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                  {file.name}
                                </span>
                              ) : (
                                docInfo.desc
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <label
                            htmlFor={key}
                            className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 font-sans text-xs font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                            <Upload className="size-3.5" />
                            <span>{file ? "Change File" : "Upload"}</span>
                          </label>

                          <input
                            id={key}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={(e) =>
                              handleFileChange(key, e.target.files?.[0] ?? null)
                            }
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
              <p className="font-sans text-xs md:text-sm">
                Ensure information matches official documents.
              </p>
            </div>

            <Button
              className="h-12 shrink-0 rounded-xl px-8 font-sans text-sm font-semibold"
              type="submit"
              disabled={isLoading}
              size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2.5 size-4 animate-spin" />
                  {isResubmission ? "Resubmitting..." : "Submitting..."}
                </>
              ) : (
                <>
                  {isResubmission
                    ? "Resubmit Application"
                    : "Submit Application"}

                  <ArrowRight className="ml-2.5 size-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
