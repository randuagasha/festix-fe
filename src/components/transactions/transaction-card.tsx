"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Ticket,
  Receipt,
  CheckCircle2,
  Clock3,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CustomerTransaction } from "./transactions-types";

interface TransactionCardProps {
  transaction: CustomerTransaction;
  onViewDetails: (tx: CustomerTransaction) => void;
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

function formatDate(dateString: string) {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d) + " WIB";
  } catch {
    return dateString;
  }
}

export function TransactionCard({
  transaction,
  onViewDetails,
  hasTickets = false,
}: TransactionCardProps) {
  const firstItem = transaction.orderItems[0];
  const event = firstItem?.ticketType?.event;

  const totalTickets = transaction.orderItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const isExpired =
    transaction.paymentStatus === "EXPIRED" ||
    (transaction.paymentStatus === "PENDING" &&
      new Date(transaction.expiresAt).getTime() <= Date.now());

  const effectiveStatus = isExpired ? "EXPIRED" : transaction.paymentStatus;
  const canContinuePayment =
    transaction.paymentStatus === "PENDING" && !isExpired && transaction.paymentUrl;

  return (
    <div className="group relative flex flex-col md:flex-row items-stretch justify-between rounded-2xl border border-border/80 bg-card p-4 sm:p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 flex-1 min-w-0">
        {/* Event Thumbnail */}
        {event?.coverImageUrl ? (
          <div className="relative h-32 sm:h-26 sm:w-36 rounded-xl overflow-hidden shrink-0 border border-border/50 bg-muted">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-32 sm:h-26 sm:w-36 rounded-xl bg-primary/10 items-center justify-center shrink-0 border border-primary/20">
            <Ticket className="size-8 text-primary" />
          </div>
        )}

        {/* Transaction Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <Receipt className="size-3 text-muted-foreground/70" />
                #{transaction.orderNumber}
              </span>
              <span className="text-[11px] text-muted-foreground/60">•</span>
              <span className="text-[11px] text-muted-foreground">
                {formatDate(transaction.createdAt)}
              </span>
            </div>

            <h3 className="font-heading text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {event?.title || "Pesanan Tiket"}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Ticket className="size-3.5 text-primary" />
                {totalTickets} Tiket ({transaction.orderItems.map((i) => i.ticketType?.name).filter(Boolean).join(", ")})
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block">
                Total Transaksi
              </span>
              <span className="font-heading text-sm sm:text-base font-bold text-foreground">
                {formatIDR(transaction.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Status & Actions */}
      <div className="mt-4 md:mt-0 md:ml-6 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/60 shrink-0">
        {/* Status Badge */}
        <div>
          {effectiveStatus === "PAID" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle2 className="size-3.5" />
              Lunas
            </span>
          )}
          {effectiveStatus === "PENDING" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Clock3 className="size-3.5" />
              Menunggu Bayar
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {effectiveStatus === "PAID" && (
            <Link href={`/customers/my-tickets?orderId=${transaction.id}`}>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl h-8.5 px-3.5 gap-1.5 shadow-2xs"
              >
                <Ticket className="size-3.5" />
                Lihat Tiket
              </Button>
            </Link>
          )}

          {canContinuePayment && (
            <Button
              size="sm"
              onClick={() => {
                if (transaction.paymentUrl) {
                  window.open(transaction.paymentUrl, "_blank", "noopener,noreferrer");
                }
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl h-8.5 px-3.5 gap-1.5 shadow-2xs"
            >
              <ExternalLink className="size-3.5" />
              Bayar Sekarang
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(transaction)}
            className="text-xs font-medium rounded-xl h-8.5 px-3 border-border hover:bg-muted"
          >
            <Eye className="size-3.5" />
            <span className="hidden sm:inline">Detail</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
