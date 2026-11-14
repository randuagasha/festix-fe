"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { API_URL } from "../../api";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false);
  const [privacyScrolledToBottom, setPrivacyScrolledToBottom] = useState(false);

  const termsScrollRef = useRef<HTMLDivElement>(null);
  const privacyScrollRef = useRef<HTMLDivElement>(null);

  // Password validation checks
  const password = formData.password;
  const passwordChecks = [
    {
      id: "min-length",
      label: "Minimum 8 characters",
      met: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "At least one number (0-9)",
      met: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "At least one special character (e.g. !@#$%^&*)",
      met: /[^A-Za-z0-9\s]/.test(password),
    },
  ];

  const allPasswordRequirementsMet = passwordChecks.every((check) => check.met);

  function resetForm() {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setTermsAccepted(false);
    setPrivacyAccepted(false);
  }

  function handleInputChanges({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function openTermsModal() {
    setTermsScrolledToBottom(false);
    setTermsModalOpen(true);
  }

  function openPrivacyModal() {
    setPrivacyScrolledToBottom(false);
    setPrivacyModalOpen(true);
  }

  function handleAcceptTerms() {
    setTermsAccepted(true);
    setTermsModalOpen(false);
  }

  function handleAcceptPrivacy() {
    setPrivacyAccepted(true);
    setPrivacyModalOpen(false);
  }

  function handleTermsScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight <= el.clientHeight) {
      return;
    }
    if (Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 10) {
      setTermsScrolledToBottom(true);
    }
  }

  function handlePrivacyScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight <= el.clientHeight) {
      return;
    }
    if (Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 10) {
      setPrivacyScrolledToBottom(true);
    }
  }

  useEffect(() => {
    if (termsModalOpen && termsScrollRef.current) {
      termsScrollRef.current.scrollTop = 0;
    }
  }, [termsModalOpen]);

  useEffect(() => {
    if (privacyModalOpen && privacyScrollRef.current) {
      privacyScrollRef.current.scrollTop = 0;
    }
  }, [privacyModalOpen]);

  async function handleSubmit() {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please Fill in All The Fields", {
        position: "top-center",
      });
      return;
    }

    if (!allPasswordRequirementsMet) {
      toast.error("Password does not meet all security requirements", {
        position: "top-center",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and Confirm Password do not match", {
        position: "top-center",
      });
      return;
    }

    if (!termsAccepted) {
      toast.error("Please agree to the Terms & Conditions", {
        position: "top-center",
      });
      return;
    }

    if (!privacyAccepted) {
      toast.error("Please agree to the Privacy Policy", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed", {
          position: "top-center",
        });
        return;
      }

      toast.success("Berhasil Register Akun! Silakan verifikasi email kamu.", {
        position: "top-center",
      });

      const verifyEmail = data.email || formData.email;
      resetForm();
      router.push(`/auth/verify-email?email=${encodeURIComponent(verifyEmail)}`);
    } catch {
      toast.error("Failed to Create an Account, Please try again!", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold font-heading">Buat Akun</h1>
            <p className="font-sans text-sm text-muted-foreground">
              Daftar untuk menggunakan fitur yang tersedia dan mengikuti event favoritmu
            </p>
          </div>

          <Field>
            <FieldLabel className="font-sans" htmlFor="name">
              Nama
            </FieldLabel>
            <Input
              className="font-sans"
              id="name"
              name="fullName"
              type="text"
              placeholder="Enter your name"
              required
              onChange={(e) => handleInputChanges(e.target)}
              value={formData.fullName}
            />
          </Field>

          <Field>
            <FieldLabel className="font-sans" htmlFor="email">
              Email Address
            </FieldLabel>
            <Input
              className="font-sans"
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => handleInputChanges(e.target)}
              value={formData.email}
            />
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel className="font-sans" htmlFor="password">
                Buat Password
              </FieldLabel>
            </div>
            <PasswordInput
              className="font-sans"
              id="password"
              name="password"
              placeholder="Buat password"
              required
              onChange={(e) => handleInputChanges(e.target)}
              value={formData.password}
            />

            {/* Real-time Password Requirements Indicator */}
            <div className="mt-2.5 rounded-lg border border-border bg-card p-3 space-y-2">
              <p className="font-sans text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Password Requirements
              </p>
              <ul className="space-y-1.5 font-sans text-xs">
                {passwordChecks.map((check) => (
                  <li
                    key={check.id}
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      check.met
                        ? "text-emerald-600 font-medium"
                        : "text-destructive"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full text-[10px]",
                        check.met
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {check.met ? (
                        <Check className="size-3 stroke-[2.5]" />
                      ) : (
                        <X className="size-3 stroke-[2.5]" />
                      )}
                    </span>
                    <span>{check.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel className="font-sans" htmlFor="confirmPassword">
                Konfirmasi Password
              </FieldLabel>
            </div>
            <PasswordInput
              className="font-sans"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Konfirmasi password"
              required
              onChange={(e) => handleInputChanges(e.target)}
              value={formData.confirmPassword}
            />
          </Field>

          {/* Consent Checkboxes */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="terms-checkbox"
                name="terms-checkbox"
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  if (checked) {
                    openTermsModal();
                  } else {
                    setTermsAccepted(false);
                  }
                }}
                className="mt-0.5 cursor-pointer"
              />
              <div className="font-sans text-xs text-muted-foreground leading-normal select-none">
                <span
                  onClick={() => {
                    if (!termsAccepted) {
                      openTermsModal();
                    } else {
                      setTermsAccepted(false);
                    }
                  }}
                  className="cursor-pointer"
                >
                  I agree to the{" "}
                </span>
                <button
                  type="button"
                  onClick={openTermsModal}
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
                .
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Checkbox
                id="privacy-checkbox"
                name="privacy-checkbox"
                checked={privacyAccepted}
                onCheckedChange={(checked) => {
                  if (checked) {
                    openPrivacyModal();
                  } else {
                    setPrivacyAccepted(false);
                  }
                }}
                className="mt-0.5 cursor-pointer"
              />
              <div className="font-sans text-xs text-muted-foreground leading-normal select-none">
                <span
                  onClick={() => {
                    if (!privacyAccepted) {
                      openPrivacyModal();
                    } else {
                      setPrivacyAccepted(false);
                    }
                  }}
                  className="cursor-pointer"
                >
                  I agree to the{" "}
                </span>
                <button
                  type="button"
                  onClick={openPrivacyModal}
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                .
              </div>
            </div>
          </div>

          <Field>
            <Button
              className="font-sans w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Create Account
            </Button>
          </Field>

          <Field>
            <FieldDescription className="text-center font-sans">
              Do you have an account?{" "}
              <a
                href="/auth/login"
                className="underline text-primary underline-offset-4"
              >
                Sign In
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>

      {/* Terms & Conditions Modal */}
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogPopup className="max-w-lg p-6">
          <DialogTitle className="font-heading text-lg font-bold text-foreground">
            Terms &amp; Conditions
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-muted-foreground mt-1">
            Please review the entire agreement below. Scroll to the bottom to enable acceptance.
          </DialogDescription>

          <div
            ref={termsScrollRef}
            onScroll={handleTermsScroll}
            className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-border bg-muted/20 p-4 text-xs font-sans text-muted-foreground space-y-4 select-text"
          >
            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                1. Acceptance of Terms
              </h4>
              <p className="leading-relaxed">
                By registering an account, accessing, or purchasing tickets through Festix, you agree to be legally bound by these Terms and Conditions. If you do not agree to all terms stated herein, you must refrain from using the platform.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                2. User Account and Security
              </h4>
              <p className="leading-relaxed">
                You must provide accurate, current, and complete information during registration. You are solely responsible for safeguarding your password and account credentials. Any activities occurring under your authenticated session are your legal responsibility.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                3. Ticket Purchases and Payment Processing
              </h4>
              <p className="leading-relaxed">
                All ticket orders are subject to availability and payment confirmation by authorized payment gateways. Ticket prices and quotas are determined by event organizers. Festix does not store payment card numbers or bank credentials on its servers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                4. Issued Tickets and QR Code Validation
              </h4>
              <p className="leading-relaxed">
                Upon verified payment, unique digital tickets with corresponding QR codes are generated. Each ticket is valid for one-time admission only and must be validated at the venue by assigned event staff. Duplication, alteration, or unauthorized resale of tickets is strictly prohibited.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                5. Event Rescheduling, Cancellations, and Refunds
              </h4>
              <p className="leading-relaxed">
                Event schedules, lineups, and policies are managed directly by event organizers. In the event of postponement or cancellation, refunds will be issued strictly according to the organizer&apos;s refund policy and processed through original payment channels.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                6. Prohibited Activities
              </h4>
              <p className="leading-relaxed">
                Users may not engage in automated scraping, bot-driven ticket purchases, fraudulent transactions, or attempts to compromise platform infrastructure. Violations will result in immediate account termination and potential legal recourse.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                7. Limitation of Liability
              </h4>
              <p className="leading-relaxed">
                Festix provides a ticketing facilitation marketplace and is not liable for organizer actions, event execution quality, personal property, or venue conditions. Users attend events at their own risk.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                8. Governing Law and Amendments
              </h4>
              <p className="leading-relaxed">
                These terms are governed by the laws of the Republic of Indonesia. Festix reserves the right to modify these terms with reasonable notice posted on the platform. Continued use indicates agreement to revised terms.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="font-sans text-[11px] text-muted-foreground">
              {termsScrolledToBottom ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="size-3" /> End of document reached
                </span>
              ) : (
                "Scroll to bottom to accept"
              )}
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTermsModalOpen(false)}
                className="font-sans text-xs"
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!termsScrolledToBottom}
                onClick={handleAcceptTerms}
                className="bg-primary text-white hover:bg-primary/90 font-sans text-xs disabled:opacity-50"
              >
                Agree &amp; Accept
              </Button>
            </div>
          </div>
        </DialogPopup>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogPopup className="max-w-lg p-6">
          <DialogTitle className="font-heading text-lg font-bold text-foreground">
            Privacy Policy
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-muted-foreground mt-1">
            Please review our data protection practices below. Scroll to the bottom to enable acceptance.
          </DialogDescription>

          <div
            ref={privacyScrollRef}
            onScroll={handlePrivacyScroll}
            className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-border bg-muted/20 p-4 text-xs font-sans text-muted-foreground space-y-4 select-text"
          >
            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                1. Information We Collect
              </h4>
              <p className="leading-relaxed">
                We collect information you provide directly to us when registering, such as your full name, email address, password hash, and transaction records. We also process necessary operational metadata to deliver and secure our ticketing services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                2. How We Use Your Data
              </h4>
              <p className="leading-relaxed">
                Your data is utilized to authenticate your identity, generate and issue unique QR-code tickets, communicate order confirmations, provide customer support, and maintain audit logs for platform security.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                3. Data Sharing and Third-Party Processors
              </h4>
              <p className="leading-relaxed">
                We do not sell your personal data. We share relevant transaction data with authorized payment processors (to execute payments) and event organizers (for venue admittance verification). All processors adhere to strict confidentiality standards.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                4. Data Protection and Encryption
              </h4>
              <p className="leading-relaxed">
                We apply modern encryption protocols (TLS/SSL) for all sensitive data transfers. Passwords are securely hashed before storage, and administrative access is restricted through role-based access control and audit monitoring.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                5. Cookies and Session Tokens
              </h4>
              <p className="leading-relaxed">
                Festix uses essential session cookies to maintain your login status and protect against cross-site request forgery. These cookies are required for platform operations and account authentication.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                6. User Rights and Data Retention
              </h4>
              <p className="leading-relaxed">
                You have the right to review, update, or request the deletion of your account information. We retain personal data for as long as your account is active or as necessary to comply with financial and legal reporting obligations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs mb-1">
                7. Security Updates and Contact
              </h4>
              <p className="leading-relaxed">
                We may periodically revise this policy to reflect technological or regulatory updates. For privacy inquiries or rights enforcement, contact our data protection team via support@festix.com.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="font-sans text-[11px] text-muted-foreground">
              {privacyScrolledToBottom ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="size-3" /> End of document reached
                </span>
              ) : (
                "Scroll to bottom to accept"
              )}
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPrivacyModalOpen(false)}
                className="font-sans text-xs"
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!privacyScrolledToBottom}
                onClick={handleAcceptPrivacy}
                className="bg-primary text-white hover:bg-primary/90 font-sans text-xs disabled:opacity-50"
              >
                Agree &amp; Accept
              </Button>
            </div>
          </div>
        </DialogPopup>
      </Dialog>
    </>
  );
}
