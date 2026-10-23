"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { API_URL } from "../../../api";
import type { PublicEventDetail, EventDetailTicketType } from "@/types/event-detail";
import { toast } from "sonner";

function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

function formatEventSchedule(dateString: string) {
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

interface SelectedItem {
  ticketTypeId: string;
  quantity: number;
}

export function TransactionDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("eventId");
  const itemsParam = searchParams.get("items");

  const [event, setEvent] = useState<PublicEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submitRef = useRef(false);

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  useEffect(() => {
    if (!eventId) {
      setError("MISSING_EVENT");
      setLoading(false);
      return;
    }

    let parsed: SelectedItem[] = [];
    try {
      parsed = JSON.parse(decodeURIComponent(itemsParam || "[]"));
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError("INVALID_SELECTION");
        setLoading(false);
        return;
      }
      for (const item of parsed) {
        if (!item.ticketTypeId || typeof item.quantity !== "number" || item.quantity < 1) {
          setError("INVALID_SELECTION");
          setLoading(false);
          return;
        }
      }
    } catch {
      setError("INVALID_SELECTION");
      setLoading(false);
      return;
    }

    setSelectedItems(parsed);

    let ignore = false;
    async function fetchEvent() {
      try {
        const baseUrl = API_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/events/${encodeURIComponent(eventId!)}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (!ignore) setError(res.status === 404 ? "EVENT_NOT_FOUND" : "SERVER_ERROR");
          return;
        }

        const data: PublicEventDetail = await res.json();

        const validItems = parsed.filter((item) =>
          data.ticketTypes.some(
            (tt) => tt.id === item.ticketTypeId && tt.availableQuota >= item.quantity
          )
        );

        if (validItems.length === 0 && parsed.length > 0) {
          if (!ignore) setError("TICKETS_UNAVAILABLE");
          if (!ignore) setEvent(data);
          return;
        }

        if (!ignore) {
          setEvent(data);
          setSelectedItems(validItems);
        }
      } catch {
        if (!ignore) setError("NETWORK_ERROR");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchEvent();
    return () => { ignore = true; };
  }, [eventId, itemsParam]);

  function getTicketType(ticketTypeId: string): EventDetailTicketType | undefined {
    return event?.ticketTypes.find((tt) => tt.id === ticketTypeId);
  }

  function getLinePrice(item: SelectedItem): number {
    const tt = getTicketType(item.ticketTypeId);
    if (!tt) return 0;
    const price = typeof tt.price === "string" ? parseFloat(tt.price) : tt.price;
    return isNaN(price) ? 0 : price * item.quantity;
  }

  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + getLinePrice(item), 0);

  async function handleConfirmTransaction() {
    if (submitting || submitRef.current) return;
    submitRef.current = true;
    setSubmitting(true);

    const token = Cookies.get("token");
    if (!token) {
      toast.error("Silakan login terlebih dahulu untuk melanjutkan pembelian.", {
        position: "top-center",
      });
      router.push("/auth/login");
      submitRef.current = false;
      setSubmitting(false);
      return;
    }

    try {
      const baseUrl = API_URL || "http://localhost:8000";
      const idempotencyKey = `${eventId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const res = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: selectedItems.map((item) => ({
            ticketTypeId: item.ticketTypeId,
            quantity: item.quantity,
          })),
          idempotencyKey,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage =
          errorData?.message ||
          (res.status === 401
            ? "Sesi Anda telah berakhir. Silakan login kembali."
            : res.status === 409
              ? "Kuota tiket tidak mencukupi atau event sudah tidak tersedia."
              : "Gagal membuat pesanan. Silakan coba lagi.");

        if (res.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
        }

        toast.error(typeof errorMessage === "string" ? errorMessage : "Gagal membuat pesanan.", {
          position: "top-center",
        });
        submitRef.current = false;
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      const paymentUrl = data?.paymentUrl;

      if (!paymentUrl) {
        toast.error("Pesanan berhasil dibuat tetapi URL pembayaran tidak tersedia. Silakan cek halaman pesanan Anda.", {
          position: "top-center",
        });
        submitRef.current = false;
        setSubmitting(false);
        return;
      }

      window.location.href = paymentUrl;
    } catch {
      toast.error("Terjadi kesalahan jaringan. Periksa koneksi internet Anda dan coba lagi.", {
        position: "top-center",
      });
      submitRef.current = false;
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-svh bg-background">
        <HomeNavbar />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-64 rounded-xl bg-muted" />
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-7">
                  <div className="h-48 rounded-2xl bg-muted" />
                  <div className="h-32 rounded-2xl bg-muted" />
                </div>
                <div className="lg:col-span-5">
                  <div className="h-64 rounded-2xl bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <HomeFooter />
      </div>
    );
  }

  if (error === "MISSING_EVENT" || error === "INVALID_SELECTION") {
    return (
      <div className="min-h-svh bg-background flex flex-col justify-between">
        <HomeNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="mx-auto max-w-md text-center rounded-3xl border border-border bg-card p-8 shadow-xs">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-7" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
              {error === "MISSING_EVENT" ? "Data Pesanan Tidak Valid" : "Pilihan Tiket Tidak Valid"}
            </h2>
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {error === "MISSING_EVENT"
                ? "Tautan ini tidak memiliki informasi event yang diperlukan."
                : "Pilihan tiket tidak valid atau kosong. Silakan pilih tiket kembali."}
            </p>
            <Link
              href="/customers/home"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/95"
            >
              <ArrowLeft className="size-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </main>
        <HomeFooter />
      </div>
    );
  }

  if (error === "EVENT_NOT_FOUND" || error === "TICKETS_UNAVAILABLE" || error === "SERVER_ERROR" || error === "NETWORK_ERROR") {
    return (
      <div className="min-h-svh bg-background flex flex-col justify-between">
        <HomeNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="mx-auto max-w-md text-center rounded-3xl border border-border bg-card p-8 shadow-xs">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-7" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
              {error === "EVENT_NOT_FOUND"
                ? "Event Tidak Ditemukan"
                : error === "TICKETS_UNAVAILABLE"
                  ? "Tiket Tidak Tersedia"
                  : "Gagal Memuat Data"}
            </h2>
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {error === "TICKETS_UNAVAILABLE"
                ? "Tiket yang Anda pilih sudah tidak tersedia. Silakan pilih tiket lain."
                : "Terjadi kendala. Silakan coba lagi."}
            </p>
            {event ? (
              <Link
                href={`/events/detail?id=${event.id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/95"
              >
                <ArrowLeft className="size-4" />
                <span>Kembali ke Detail Event</span>
              </Link>
            ) : (
              <Link
                href="/customers/home"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/95"
              >
                <ArrowLeft className="size-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            )}
          </div>
        </main>
        <HomeFooter />
      </div>
    );
  }

  if (!event) return null;

  const schedule = formatEventSchedule(event.startDatetime);

  return (
    <div className="min-h-svh bg-background flex flex-col justify-between">
      <HomeNavbar />

      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href={`/events/detail?id=${event.id}`}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                Review Pesanan
              </h1>
              <p className="font-sans text-xs text-muted-foreground">
                Periksa kembali detail pesanan Anda sebelum melanjutkan pembayaran
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <Card className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
                <div className="flex items-start gap-4 p-5 sm:p-6">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:size-24">
                    {event.coverImageUrl ? (
                      <Image
                        src={event.coverImageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                        <Ticket className="size-8" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <h2 className="font-heading text-base font-bold text-foreground line-clamp-2 sm:text-lg">
                      {event.title}
                    </h2>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                        <Calendar className="size-3.5 shrink-0 text-primary" />
                        <span>{schedule.dayName}, {schedule.fullDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                        <Clock className="size-3.5 shrink-0 text-primary" />
                        <span>Mulai {schedule.timeString}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0 text-primary" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
                <div className="border-b border-border bg-muted/40 p-5">
                  <div className="flex items-center gap-2">
                    <Ticket className="size-5 text-primary" />
                    <h3 className="font-heading text-base font-bold text-foreground">
                      Detail Tiket
                    </h3>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {selectedItems.map((item) => {
                    const tt = getTicketType(item.ticketTypeId);
                    if (!tt) return null;
                    const unitPrice = typeof tt.price === "string" ? parseFloat(tt.price) : tt.price;
                    const lineTotal = isNaN(unitPrice) ? 0 : unitPrice * item.quantity;

                    return (
                      <div key={item.ticketTypeId} className="p-5 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-heading text-sm font-bold text-foreground">
                            {tt.name}
                          </h4>
                          <p className="font-sans text-xs text-muted-foreground mt-0.5">
                            {item.quantity}x {formatIDR(unitPrice)}
                          </p>
                        </div>
                        <span className="font-heading text-sm font-bold text-foreground whitespace-nowrap">
                          {formatIDR(lineTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
                <div className="font-sans text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Pembayaran Aman melalui Xendit</p>
                  <p>Anda akan diarahkan ke halaman pembayaran Xendit setelah konfirmasi pesanan. E-tiket akan terbit otomatis setelah pembayaran berhasil diverifikasi.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="border-b border-border bg-muted/40 p-5">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      Ringkasan Pesanan
                    </h3>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-3">
                      {selectedItems.map((item) => {
                        const tt = getTicketType(item.ticketTypeId);
                        if (!tt) return null;
                        return (
                          <div key={item.ticketTypeId} className="flex items-center justify-between font-sans text-sm">
                            <span className="text-muted-foreground">
                              {tt.name} x{item.quantity}
                            </span>
                            <span className="font-medium text-foreground">
                              {formatIDR(getLinePrice(item))}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-sm text-muted-foreground">Total tiket</span>
                        <span className="font-heading text-sm font-bold text-foreground">
                          {totalQuantity} tiket
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-base font-bold text-foreground">Total</span>
                        <span className="font-heading text-xl font-bold text-primary">
                          {formatIDR(totalPrice)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirmTransaction}
                      disabled={submitting || selectedItems.length === 0}
                      className="w-full gap-2 rounded-2xl font-sans text-sm font-semibold h-12"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Memproses Pembayaran...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="size-4" />
                          Konfirmasi & Bayar
                        </>
                      )}
                    </Button>

                    <p className="text-center font-sans text-[11px] text-muted-foreground">
                      Dengan melanjutkan, Anda menyetujui ketentuan pembelian tiket Tixora.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
