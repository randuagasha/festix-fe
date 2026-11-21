"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  X,
  CreditCard,
  Receipt,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogPopup,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CustomerTransaction } from "./transactions-types";

interface TransactionDetailModalProps {
  transaction: CustomerTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasTickets?: boolean;
}

function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDateTime(dateString: string) {
  try {
    const d = new Date(dateString);
    const dateFormatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
    const timeFormatted =
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d) + " WIB";
    return `${dateFormatted}, ${timeFormatted}`;
  } catch {
    return dateString;
  }
}

export function TransactionDetailModal({
  transaction,
  open,
  onOpenChange,
  hasTickets = false,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const firstItem = transaction.orderItems[0];
  const event = firstItem?.ticketType?.event;

  const isExpired =
    transaction.paymentStatus === "EXPIRED" ||
    (transaction.paymentStatus === "PENDING" &&
      new Date(transaction.expiresAt).getTime() <= Date.now());

  const effectiveStatus = isExpired ? "EXPIRED" : transaction.paymentStatus;
  const canContinuePayment =
    transaction.paymentStatus === "PENDING" && !isExpired && transaction.paymentUrl;

  const totalTickets = transaction.orderItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="w-[94vw] max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-border bg-card">
        <div className="relative">
          <DialogClose className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="size-4" />
          </DialogClose>

          <div className="p-6 sm:p-7 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Receipt className="size-4 text-primary" />
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  #{transaction.orderNumber}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <DialogTitle className="font-heading text-xl font-bold text-foreground">
                  Detail Transaksi
                </DialogTitle>

                {/* Status Badge */}
                {effectiveStatus === "PAID" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="size-3.5" />
                    Lunas
                  </span>
                )}
                {effectiveStatus === "PENDING" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <Clock3 className="size-3.5" />
                    Menunggu Pembayaran
                  </span>
                )}
                {effectiveStatus === "EXPIRED" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                    <AlertCircle className="size-3.5" />
                    Kadaluarsa
                  </span>
                )}
                {effectiveStatus === "FAILED" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                    <XCircle className="size-3.5" />
                    Gagal
                  </span>
                )}
              </div>
              <DialogDescription className="font-sans text-xs text-muted-foreground mt-1">
                Waktu Transaksi: {formatDateTime(transaction.createdAt)}
              </DialogDescription>
            </div>

            {/* Event Summary Card */}
            {event && (
              <div className="flex gap-4 p-3.5 rounded-2xl bg-secondary/30 border border-border/70">
                {event.coverImageUrl ? (
                  <div className="relative size-18 rounded-xl overflow-hidden shrink-0 border border-border/50">
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-18 rounded-xl bg-primary/10 items-center justify-center shrink-0 border border-primary/20">
                    <Ticket className="size-7 text-primary" />
                  </div>
                )}
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <h4 className="font-heading text-sm font-bold text-foreground line-clamp-1">
                    {event.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5 text-primary shrink-0" />
                    <span className="truncate">
                      {formatDateTime(event.startDatetime)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items Breakdown */}
            <div className="space-y-3">
              <h5 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rincian Tiket Dibeli ({totalTickets} Tiket)
              </h5>
              <div className="rounded-2xl border border-border/70 divide-y divide-border/60 overflow-hidden bg-card">
                {transaction.orderItems.map((item) => {
                  const itemPrice = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                  const itemSubtotal = itemPrice * item.quantity;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 text-xs font-sans"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.ticketType?.name || "Tiket"}
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          {formatIDR(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        {formatIDR(itemSubtotal)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="rounded-2xl bg-secondary/20 p-4 border border-border/70 space-y-2.5 font-sans text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Metode Pembayaran</span>
                <span className="font-medium text-foreground">
                  {transaction.paymentMethod?.replace(/_/g, " ") || "Xendit Checkout"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Batas Pembayaran</span>
                <span className="font-medium text-foreground">
                  {formatDateTime(transaction.expiresAt)}
                </span>
              </div>
              <div className="border-t border-border/60 pt-2.5 flex justify-between items-center">
                <span className="font-semibold text-foreground text-sm">
                  Total Pembayaran
                </span>
                <span className="font-heading text-base font-bold text-primary">
                  {formatIDR(transaction.totalAmount)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {effectiveStatus === "PAID" && (
                <Link
                  href={`/customers/my-tickets?orderId=${transaction.id}`}
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-10 gap-2 shadow-xs">
                    <Ticket className="size-4" />
                    Lihat E-Tiket Saya
                  </Button>
                </Link>
              )}

              {canContinuePayment && (
                <Button
                  onClick={() => {
                    if (transaction.paymentUrl) {
                      window.open(transaction.paymentUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl h-10 gap-2 shadow-xs"
                >
                  <ExternalLink className="size-4" />
                  Lanjutkan Pembayaran
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-10 font-medium border-border"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
}
