"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Keyboard,
  MapPin,
  QrCode,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Ticket,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  staffFetch,
  StaffApiError,
  type TicketLookupResult,
  type TicketRedemptionResult,
} from "@/lib/staff-api";

type QrScannerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferredEventId?: string;
  onRedemptionSuccess?: () => void;
};

type Step = "scan" | "review" | "success" | "error";

export function QrScannerModal({
  open,
  onOpenChange,
  preferredEventId,
  onRedemptionSuccess,
}: QrScannerModalProps) {
  const [step, setStep] = useState<Step>("scan");
  const [activeTab, setActiveTab] = useState<"camera" | "manual">("camera");

  // Camera states
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isWithinSchedule, setIsWithinSchedule] = useState(true);

  // Data states
  const [ticketData, setTicketData] = useState<TicketLookupResult | null>(null);
  const [redemptionData, setRedemptionData] = useState<TicketRedemptionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [manualCode, setManualCode] = useState("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch {
        // scanner stop error swallowed on teardown
      }
      scannerRef.current = null;
    }
  }, []);

  const handleLookup = useCallback(async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      toast.error("Please enter a ticket code");
      return;
    }

    setIsLookingUp(true);
    setErrorMessage("");

    try {
      const data = await staffFetch<TicketLookupResult>("/ticket-redemption/lookup", {
        method: "POST",
        body: JSON.stringify({ ticketCode: trimmed }),
      });

      const now = Date.now();
      const start = new Date(data.event.startDatetime).getTime();
      const end = new Date(data.event.endDatetime).getTime();
      setIsWithinSchedule(now >= start && now <= end);

      setTicketData(data);
      setStep("review");
    } catch (err) {
      const msg = err instanceof StaffApiError ? err.message : "Failed to lookup ticket";
      setErrorMessage(msg);
      setStep("error");
    } finally {
      setIsLookingUp(false);
      isProcessingRef.current = false;
    }
  }, []);

  const startScanner = useCallback(async () => {
    setCameraError(null);

    try {
      const html5QrCode = new Html5Qrcode("staff-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;

          // Stop camera once scanned
          await stopScanner();

          // Trigger lookup with raw scanned text
          await handleLookup(decodedText);
        },
        () => {
          // ignore scan frame misses
        },
      );
    } catch (err) {
      const errStr = String(err);
      if (errStr.includes("NotAllowedError") || errStr.includes("Permission")) {
        setCameraError("Camera permission denied. Please enable camera access in your browser settings.");
      } else {
        setCameraError("Unable to access camera. Please check your camera connection or use manual input.");
      }
      scannerRef.current = null;
    }
  }, [handleLookup, stopScanner]);

  // Manage scanner lifecycle on modal open/close or step changes
  useEffect(() => {
    if (!open) {
      stopScanner();
      return;
    }

    if (step === "scan" && activeTab === "camera") {
      const timer = setTimeout(() => {
        startScanner();
      }, 250);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [open, step, activeTab, startScanner, stopScanner]);

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setStep("scan");
      setTicketData(null);
      setRedemptionData(null);
      setErrorMessage("");
      setManualCode("");
      isProcessingRef.current = false;
    }
    onOpenChange(newOpen);
  }

  async function handleConfirmRedemption() {
    if (!ticketData) return;

    setIsRedeeming(true);
    try {
      const res = await staffFetch<TicketRedemptionResult>("/ticket-redemption/redeem", {
        method: "POST",
        body: JSON.stringify({ ticketCode: ticketData.ticketCode }),
      });

      setRedemptionData(res);
      setStep("success");
      toast.success("Ticket redeemed successfully");
      if (onRedemptionSuccess) {
        onRedemptionSuccess();
      }
    } catch (err) {
      const msg = err instanceof StaffApiError ? err.message : "Failed to redeem ticket";
      toast.error(msg);
      setErrorMessage(msg);
      setStep("error");
    } finally {
      setIsRedeeming(false);
    }
  }

  function handleScanNext() {
    setTicketData(null);
    setRedemptionData(null);
    setErrorMessage("");
    setManualCode("");
    isProcessingRef.current = false;
    setStep("scan");
  }

  // Format date helper
  function formatSchedule(dt: string) {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const isAssignedEventMatch = (() => {
    if (!ticketData || !preferredEventId) return true;
    return ticketData.event.id === preferredEventId;
  })();

  const canRedeem =
    ticketData &&
    !ticketData.isRedeemed &&
    !ticketData.isCancelled &&
    ticketData.order.paymentStatus === "PAID" &&
    ticketData.event.status === "PUBLISHED" &&
    isWithinSchedule &&
    isAssignedEventMatch;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup className="max-w-xl p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <QrCode className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  {step === "scan" && "Scan Attendee Ticket"}
                  {step === "review" && "Validate & Review Ticket"}
                  {step === "success" && "Redemption Confirmed"}
                  {step === "error" && "Validation Error"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {step === "scan" && "Position QR code in camera view or enter ticket code"}
                  {step === "review" && "Confirm ticket legitimacy and attendee identity before entry"}
                  {step === "success" && "Attendee verified and checked-in to event"}
                  {step === "error" && "Ticket cannot be redeemed under current constraints"}
                </DialogDescription>
              </div>
            </div>

            <DialogClose render={<Button variant="ghost" size="icon-sm" />} />
          </div>

          {/* Mode Switcher for Scan Step */}
          {step === "scan" && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("camera")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 font-sans text-xs font-semibold transition-colors ${
                  activeTab === "camera"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Camera className="size-3.5" />
                Live Camera Scanner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 font-sans text-xs font-semibold transition-colors ${
                  activeTab === "manual"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Keyboard className="size-3.5" />
                Manual Code Entry
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: SCAN */}
          {step === "scan" && (
            <>
              {activeTab === "camera" ? (
                <div className="space-y-4">
                  <div className="relative mx-auto aspect-square max-w-[320px] overflow-hidden rounded-2xl border-2 border-dashed border-primary/40 bg-black/90">
                    <div id="staff-reader" className="size-full" />

                    {cameraError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 p-6 text-center">
                        <AlertCircle className="size-10 text-destructive" />
                        <p className="mt-2 font-heading text-sm font-semibold">Camera Access Issue</p>
                        <p className="mt-1 font-sans text-xs text-muted-foreground">{cameraError}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("manual")}
                          className="mt-4 gap-1.5"
                        >
                          <Keyboard className="size-3.5" />
                          Use Manual Input
                        </Button>
                      </div>
                    )}

                    {isLookingUp && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 p-4">
                        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="mt-3 font-sans text-xs font-medium">Validating ticket code...</p>
                      </div>
                    )}
                  </div>

                  <p className="text-center font-sans text-xs text-muted-foreground">
                    Fit the attendee&apos;s ticket QR code inside the viewfinder to scan automatically.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLookup(manualCode);
                  }}
                  className="space-y-4 py-2"
                >
                  <div>
                    <label className="font-sans text-xs font-medium text-foreground">
                      Ticket Code
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. TIK-8F92-ABC4"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="mt-1.5 font-mono uppercase tracking-wider"
                      autoFocus
                    />
                    <span className="font-sans text-[11px] text-muted-foreground">
                      Enter the raw ticket code shown underneath the customer&apos;s QR code.
                    </span>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLookingUp || !manualCode.trim()}
                    className="w-full gap-2"
                  >
                    {isLookingUp ? "Looking up..." : "Lookup & Validate Ticket"}
                  </Button>
                </form>
              )}
            </>
          )}

          {/* STEP 2: REVIEW TICKET BEFORE REDEEMING */}
          {step === "review" && ticketData && (
            <div className="space-y-5">
              {/* Status Header Badge */}
              <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                <span className="font-sans text-xs text-muted-foreground">Validation Status:</span>
                {ticketData.isRedeemed ? (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="size-3" /> Already Redeemed
                  </Badge>
                ) : ticketData.isCancelled ? (
                  <Badge variant="destructive" className="gap-1">
                    <ShieldAlert className="size-3" /> Cancelled Ticket
                  </Badge>
                ) : ticketData.order.paymentStatus !== "PAID" ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="size-3" /> Unpaid Order
                  </Badge>
                ) : ticketData.event.status !== "PUBLISHED" ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="size-3" /> Event Not Published
                  </Badge>
                ) : !isWithinSchedule ? (
                  <Badge variant="secondary" className="gap-1 text-amber-600 bg-amber-500/10">
                    <Clock className="size-3" /> Outside Schedule Window
                  </Badge>
                ) : !isAssignedEventMatch ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="size-3" /> Event Mismatch
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1 bg-emerald-600 text-white">
                    <CheckCircle2 className="size-3" /> Valid Ticket — Ready to Redeem
                  </Badge>
                )}
              </div>

              {/* Attendee Card */}
              <div className="rounded-2xl border p-4">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Attendee Information
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserIcon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-heading text-sm font-bold text-foreground">
                      {ticketData.owner.fullName}
                    </h4>
                    <p className="truncate font-sans text-xs text-muted-foreground">
                      {ticketData.owner.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ticket & Event Card */}
              <div className="space-y-3 rounded-2xl border bg-card p-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <span className="font-sans text-[10px] uppercase text-muted-foreground">Ticket Tier</span>
                    <p className="font-heading text-sm font-bold text-foreground">{ticketData.ticketType.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-[10px] uppercase text-muted-foreground">Code</span>
                    <p className="font-mono text-xs font-bold text-primary">{ticketData.ticketCode}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Ticket className="size-3.5 text-primary" />
                    <span>{ticketData.event.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-3.5 text-primary" />
                    <span>
                      {formatSchedule(ticketData.event.startDatetime)} – {formatSchedule(ticketData.event.endDatetime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-3.5 text-primary" />
                    <span>{ticketData.event.location}</span>
                  </div>
                </div>
              </div>

              {/* Warning note if non-redeemable */}
              {!canRedeem && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                  <p className="font-semibold">Cannot Redeem This Ticket</p>
                  <p className="mt-0.5">
                    {ticketData.isRedeemed && `Already redeemed on ${formatSchedule(ticketData.redeemedAt || "")}.`}
                    {ticketData.isCancelled && "This ticket was cancelled."}
                    {ticketData.order.paymentStatus !== "PAID" && "Order has not been paid."}
                    {!isWithinSchedule && "Current time is outside the event's redemption schedule."}
                    {!isAssignedEventMatch && "This ticket is for a different event than the one currently selected."}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleScanNext}
                  className="flex-1 gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  Scan Another
                </Button>

                <Button
                  type="button"
                  disabled={!canRedeem || isRedeeming}
                  onClick={handleConfirmRedemption}
                  className="flex-1 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <CheckCircle2 className="size-4" />
                  {isRedeeming ? "Redeeming..." : "Confirm Redemption"}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === "success" && (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Ticket Successfully Redeemed
                </h3>
                <p className="mt-1 font-sans text-xs text-muted-foreground">
                  Attendee has been granted operational entry access.
                </p>
              </div>

              {ticketData && (
                <div className="mx-auto max-w-sm rounded-2xl border bg-muted/20 p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attendee:</span>
                    <span className="font-bold text-foreground">{ticketData.owner.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket Code:</span>
                    <span className="font-mono font-bold text-primary">{ticketData.ticketCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tier:</span>
                    <span className="font-semibold text-foreground">{ticketData.ticketType.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event:</span>
                    <span className="font-semibold text-foreground">{ticketData.event.title}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Redeemed At:</span>
                    <span className="font-semibold text-foreground">
                      {formatSchedule(redemptionData?.ticket?.redeemedAt || new Date().toISOString())}
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={handleScanNext}
                className="w-full max-w-sm gap-2 bg-primary text-primary-foreground"
              >
                <Sparkles className="size-4" />
                Scan Next Ticket
              </Button>
            </div>
          )}

          {/* STEP 4: ERROR STATE */}
          {step === "error" && (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="size-8" />
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Ticket Validation Failed
                </h3>
                <p className="mt-1 font-sans text-xs text-muted-foreground">
                  {errorMessage || "The ticket could not be validated or verified by the system."}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleScanNext}
                  className="gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  Try Another Ticket
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogPopup>
    </Dialog>
  );
}
