"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogPopup,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { IssuedTicketItem } from "./tickets-types";

interface TicketDetailModalProps {
  ticket: IssuedTicketItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatSchedule(dateString: string) {
  try {
    const d = new Date(dateString);
    const dayName = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(d);
    const fullDate = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
    const timeString =
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d) + " WIB";
    return { dayName, fullDate, timeString };
  } catch {
    return { dayName: "", fullDate: dateString, timeString: "" };
  }
}

export function TicketDetailModal({
  ticket,
  open,
  onOpenChange,
}: TicketDetailModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ticket || !open) {
      setQrDataUrl("");
      return;
    }

    let isMounted = true;
    QRCode.toDataURL(ticket.ticketCode, {
      width: 400,
      margin: 2,
      color: {
        dark: "#222831",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR code", err);
      });

    return () => {
      isMounted = false;
    };
  }, [ticket, open]);

  if (!ticket) return null;

  const event = ticket.orderItem.ticketType.event;
  const schedule = formatSchedule(event.startDatetime);

  async function handleDownloadPng() {
    if (!ticketRef.current || !ticket || downloading) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#222831",
      });

      const safeEventTitle = event.title
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 24);
      const safeCode = ticket.ticketCode.replace(/[^a-zA-Z0-9_-]/g, "");
      const fileName = `Tixora_${safeEventTitle}_${safeCode}.png`;

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      toast.success("E-tiket berhasil diunduh!", { position: "top-center" });
    } catch (err) {
      console.error("Failed to download ticket PNG", err);
      toast.error("Gagal mengunduh e-tiket. Silakan coba kembali.", {
        position: "top-center",
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="w-[92vw] max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-border bg-card">
        <div className="relative">
          <DialogClose className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="size-4" />
          </DialogClose>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <DialogTitle className="font-heading text-xl font-bold text-foreground">
                Detail E-Tiket
              </DialogTitle>
              <DialogDescription className="font-sans text-xs text-muted-foreground mt-1">
                Tunjukkan QR code ini kepada staf resmi di lokasi acara untuk check-in.
              </DialogDescription>
            </div>

            {/* Ticket Canvas Container (Captured for PNG download) */}
            <div
              ref={ticketRef}
              className="relative overflow-hidden rounded-3xl border border-border bg-[#222831] text-white shadow-xl"
            >
              {/* Event Header Banner inside Ticket */}
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
                {event.coverImageUrl ? (
                  <Image
                    src={event.coverImageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 540px"
                    priority
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-[#393E46] text-white/50">
                    <Ticket className="size-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-[#222831]/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-[#00adb5] px-3 py-1 font-heading text-[11px] font-bold text-white shadow-xs tracking-wider uppercase">
                    TIXORA PASS
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-white line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="font-sans text-xs text-white/80 line-clamp-1 mt-0.5">
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Event Info Details */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 font-sans text-xs">
                  <div>
                    <span className="text-white/60 text-[11px] block">Waktu Acara</span>
                    <span className="font-semibold text-white mt-0.5 block">
                      {schedule.dayName}, {schedule.fullDate}
                    </span>
                    <span className="text-white/80 text-[11px] block">
                      Mulai {schedule.timeString}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 text-[11px] block">Kategori Tiket</span>
                    <span className="font-heading font-bold text-[#00adb5] text-sm mt-0.5 block">
                      {ticket.orderItem.ticketType.name}
                    </span>
                    <span className="text-white/80 text-[11px] block">
                      Order: {ticket.orderItem.order.orderNumber}
                    </span>
                  </div>
                </div>

                {/* Perforation Divider with Half-circles */}
                <div className="relative py-2">
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 size-6 rounded-full bg-background" />
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 size-6 rounded-full bg-background" />
                  <div className="border-b-2 border-dashed border-white/20" />
                </div>

                {/* QR Code Presentation */}
                <div className="flex flex-col items-center justify-center py-2 space-y-3">
                  <div className="rounded-2xl bg-white p-3.5 shadow-md">
                    {qrDataUrl ? (
                      <div className="relative size-44 sm:size-48">
                        <Image
                          src={qrDataUrl}
                          alt={`QR Code ${ticket.ticketCode}`}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex size-44 sm:size-48 items-center justify-center text-muted-foreground">
                        <Loader2 className="size-6 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#00adb5] uppercase">
                      {ticket.ticketCode}
                    </span>
                    <p className="font-sans text-[11px] text-white/60">
                      Tunjukkan kode ini saat penukaran gelang/pintu masuk
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="pt-1">
                    {ticket.isCancelled ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 font-sans text-xs font-semibold text-red-300">
                        <AlertTriangle className="size-3.5" />
                        Tiket Dibatalkan
                      </span>
                    ) : ticket.isRedeemed ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/30 px-3 py-1 font-sans text-xs font-semibold text-zinc-300">
                        <CheckCircle2 className="size-3.5" />
                        Sudah Digunakan (Telah Di-redeem)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-sans text-xs font-semibold text-emerald-300">
                        <ShieldCheck className="size-3.5 text-emerald-400" />
                        Tiket Aktif & Valid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                onClick={handleDownloadPng}
                disabled={downloading || !qrDataUrl}
                className="flex-1 gap-2 rounded-2xl font-sans text-sm font-semibold h-11"
              >
                {downloading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Membuat E-Tiket...
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    Unduh E-Tiket (PNG)
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-2xl font-sans text-sm font-semibold h-11 sm:px-6"
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
