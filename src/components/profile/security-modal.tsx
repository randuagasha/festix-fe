"use client";

import { useState } from "react";
import {
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  changePassword,
  sendChangePasswordOtp,
  type CurrentUser,
} from "@/lib/auth-api";

type SecurityModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: CurrentUser | null;
};

type VerificationMethod = "password" | "otp";

export function SecurityModal({
  open,
  onOpenChange,
  user,
}: SecurityModalProps) {
  const [method, setMethod] = useState<VerificationMethod>("password");

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setCurrentPassword("");
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpSent(false);
    setIsSubmitting(false);
    setIsSendingOtp(false);
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  }

  async function handleSendOtp() {
    try {
      setIsSendingOtp(true);
      const res = await sendChangePasswordOtp();
      setOtpSent(true);
      toast.success(res.message || "OTP sent to your email");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send OTP";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (method === "password" && !currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (method === "otp" && !otpCode.trim()) {
      toast.error("Please enter the OTP verification code");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await changePassword({
        newPassword,
        ...(method === "password" ? { currentPassword } : { otpCode: otpCode.trim() }),
      });

      toast.success(res.message || "Password updated successfully");
      handleOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogTitle className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          Security &amp; Password
        </DialogTitle>
        <DialogDescription>
          Update your account password with your current password or via email OTP verification.
        </DialogDescription>

        <div className="mt-4 space-y-4">
          {/* Method selector tabs */}
          <div className="flex gap-2 rounded-2xl border bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => {
                setMethod("password");
                resetForm();
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-sans text-xs font-semibold transition-colors ${
                method === "password"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KeyRound className="size-3.5" />
              Current Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod("otp");
                resetForm();
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-sans text-xs font-semibold transition-colors ${
                method === "otp"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="size-3.5" />
              Email OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {/* METHOD 1: CURRENT PASSWORD */}
            {method === "password" && (
              <div>
                <label className="font-sans text-xs font-medium text-foreground">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your existing password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 font-sans text-xs"
                  required
                />
              </div>
            )}

            {/* METHOD 2: OTP VERIFICATION */}
            {method === "otp" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-xs font-medium text-foreground">
                    Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="flex items-center gap-1 font-sans text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      "Sending..."
                    ) : otpSent ? (
                      <>
                        <RotateCcw className="size-3" /> Resend OTP
                      </>
                    ) : (
                      "Send OTP Code"
                    )}
                  </button>
                </div>

                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="font-mono text-xs tracking-widest text-center"
                  maxLength={6}
                  required
                />

                <p className="font-sans text-[11px] text-muted-foreground">
                  {otpSent ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" /> OTP code was sent to {user?.email}
                    </span>
                  ) : (
                    `Click "Send OTP Code" to receive verification on ${user?.email || "your registered email"}.`
                  )}
                </p>
              </div>
            )}

            {/* NEW PASSWORD FIELDS */}
            <div className="border-t pt-3 space-y-3">
              <div>
                <label className="font-sans text-xs font-medium text-foreground">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 font-sans text-xs"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-xs font-medium text-foreground">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 font-sans text-xs"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-4">
              <DialogClose render={<Button type="button" variant="outline" size="sm" />}>
                Cancel
              </DialogClose>
              <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
                <Lock className="size-3.5" />
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      </DialogPopup>
    </Dialog>
  );
}
