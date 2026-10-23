"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Ticket, Calendar, MapPin, ShoppingCart, ImageOff } from "lucide-react";
import {
  Dialog,
  DialogPopup,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicEventDetail } from "@/types/event-detail";

function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

interface BuyTicketsModalProps {
  event: PublicEventDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BuyTicketsModal({ event, open, onOpenChange }: BuyTicketsModalProps) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const ticketTypes = event.ticketTypes ?? [];

  function getQuantity(ticketTypeId: string): number {
    return quantities[ticketTypeId] ?? 0;
  }

  function setQuantity(ticketTypeId: string, value: number) {
    setQuantities((prev) => ({ ...prev, [ticketTypeId]: value }));
  }

  function handleDecrement(ticketTypeId: string) {
    const current = getQuantity(ticketTypeId);
    if (current > 0) setQuantity(ticketTypeId, current - 1);
  }

  function handleIncrement(ticketTypeId: string, maxQuota: number) {
    const current = getQuantity(ticketTypeId);
    const max = Math.min(maxQuota, 10);
    if (current < max) setQuantity(ticketTypeId, current + 1);
  }

  const totalQuantity = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const totalPrice = ticketTypes.reduce((sum, tt) => {
    const qty = getQuantity(tt.id);
    if (qty === 0) return sum;
    const price = typeof tt.price === "string" ? parseFloat(tt.price) : tt.price;
    return sum + (isNaN(price) ? 0 : price * qty);
  }, 0);

  function handleContinue() {
    const items = ticketTypes
      .filter((tt) => getQuantity(tt.id) > 0)
      .map((tt) => ({ ticketTypeId: tt.id, quantity: getQuantity(tt.id) }));

    if (items.length === 0) return;

    const encodedItems = encodeURIComponent(JSON.stringify(items));
    router.push(`/transaction/detail?eventId=${event.id}&items=${encodedItems}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup
        className="w-[70vw] max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-0"
      >
        <div className="relative">
          <DialogClose
            className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </DialogClose>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <DialogTitle className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                Pilih Tiket
              </DialogTitle>
              <DialogDescription className="font-sans text-sm text-muted-foreground mt-1">
                Pilih kategori dan jumlah tiket yang ingin Anda pesan
              </DialogDescription>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                {event.coverImageUrl ? (
                  <Image
                    src={event.coverImageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                    <Ticket className="size-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <h3 className="font-heading text-base font-bold text-foreground line-clamp-2 sm:text-lg">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                  <Calendar className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate">{formatDate(event.startDatetime)}</span>
                </div>
                <div className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate">{event.location}</span>
                </div>
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 font-sans text-[10px] font-bold text-primary">
                  {event.category.name}
                </span>
              </div>
            </div>

            {event.venueImageUrl ? (
              <div className="space-y-2">
                <h4 className="font-heading text-sm font-bold text-foreground">Tata Letak Venue</h4>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-black">
                  <Image
                    src={event.venueImageUrl}
                    alt={`Venue layout ${event.title}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 90vw, 70vw"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-6 text-muted-foreground">
                <ImageOff className="size-4 opacity-50" />
                <span className="font-sans text-xs">Tidak ada gambar venue</span>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <Ticket className="size-4 text-primary" />
                Kategori Tiket
              </h4>

              {ticketTypes.map((tt) => {
                const qty = getQuantity(tt.id);
                const price = typeof tt.price === "string" ? parseFloat(tt.price) : tt.price;
                const numericPrice = isNaN(price) ? 0 : price;
                const isSoldOut = tt.availableQuota === 0;
                const maxQty = Math.min(tt.availableQuota, 10);

                return (
                  <div
                    key={tt.id}
                    className={cn(
                      "rounded-2xl border p-4 transition-all",
                      isSoldOut
                        ? "border-border/60 bg-muted/20 opacity-60"
                        : "border-border bg-card hover:border-primary/40 shadow-2xs"
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-heading text-sm font-bold text-foreground">
                            {tt.name}
                          </h5>
                          {isSoldOut ? (
                            <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-[10px] font-bold text-muted-foreground">
                              Habis
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-sans text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              {tt.availableQuota} tersisa
                            </span>
                          )}
                        </div>
                        <p className="font-heading text-base font-bold text-primary">
                          {formatIDR(tt.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {!isSoldOut && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDecrement(tt.id)}
                              disabled={qty === 0}
                              className={cn(
                                "flex size-8 items-center justify-center rounded-full border border-border transition-colors",
                                qty === 0
                                  ? "opacity-40 cursor-not-allowed"
                                  : "hover:bg-muted hover:text-foreground text-muted-foreground"
                              )}
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-8 text-center font-heading text-sm font-bold text-foreground">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrement(tt.id, tt.availableQuota)}
                              disabled={qty >= maxQty}
                              className={cn(
                                "flex size-8 items-center justify-center rounded-full border border-border transition-colors",
                                qty >= maxQty
                                  ? "opacity-40 cursor-not-allowed"
                                  : "hover:bg-primary hover:text-primary-foreground hover:border-primary text-muted-foreground"
                              )}
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                        )}

                        {qty > 0 && (
                          <span className="font-sans text-xs font-semibold text-foreground whitespace-nowrap">
                            {formatIDR(numericPrice * qty)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-muted-foreground">Total tiket</span>
                <span className="font-heading text-sm font-bold text-foreground">
                  {totalQuantity} tiket
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="font-sans text-sm font-semibold text-foreground">Total harga</span>
                <span className="font-heading text-lg font-bold text-primary">
                  {formatIDR(totalPrice)}
                </span>
              </div>

              <Button
                onClick={handleContinue}
                disabled={totalQuantity === 0}
                className="w-full gap-2 rounded-2xl font-sans text-sm font-semibold h-11"
              >
                <ShoppingCart className="size-4" />
                Lanjut ke Review Pesanan
              </Button>
            </div>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
}
