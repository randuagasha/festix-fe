"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Building2,
  ShieldCheck,
  Share2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { EventDetailSkeleton } from "@/components/event-detail/event-detail-skeleton";
import { BuyTicketsModal } from "@/components/event-detail/buy-tickets-modal";
import { API_URL } from "../../../api";
import type { PublicEventDetail } from "@/types/event-detail";
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

function formatEventSchedule(dateString: string): {
  dayName: string;
  fullDate: string;
  timeString: string;
} {
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

export function EventDetailContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  const [event, setEvent] = useState<PublicEventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false);

  useEffect(() => {
    if (!eventId || !eventId.trim()) {
      setLoading(false);
      setError("NO_ID");
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);
    setImageError(false);

    async function fetchEventDetail() {
      try {
        const baseUrl = API_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/events/${encodeURIComponent(eventId!.trim())}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) {
            if (!ignore) setError("NOT_FOUND");
          } else {
            if (!ignore) setError("SERVER_ERROR");
          }
          return;
        }

        const data: PublicEventDetail = await res.json();
        if (!ignore) {
          setEvent(data);
        }
      } catch {
        if (!ignore) {
          setError("NETWORK_ERROR");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchEventDetail();

    return () => {
      ignore = true;
    };
  }, [eventId]);

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tautan event disalin ke papan klip!", {
        position: "top-center",
      });
    }
  }

  // 1. Loading State
  if (loading) {
    return <EventDetailSkeleton />;
  }

  // 2. Missing ID State
  if (error === "NO_ID") {
    return (
      <div className="min-h-svh bg-background flex flex-col justify-between">
        <HomeNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="mx-auto max-w-md text-center rounded-3xl border border-border bg-card p-8 shadow-xs">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-7" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
              Parameter Event Tidak Ditemukan
            </h2>
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Tautan yang Anda akses tidak memiliki ID event yang valid. Silakan pilih event dari katalog resmi kami.
            </p>
            <Link
              href="/customers/home"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/95"
            >
              <ArrowLeft className="size-4" />
              <span>Jelajahi Event Lainnya</span>
            </Link>
          </div>
        </main>
        <HomeFooter />
      </div>
    );
  }

  // 3. Not Found / Unavailable State
  if (error === "NOT_FOUND" || !event) {
    return (
      <div className="min-h-svh bg-background flex flex-col justify-between">
        <HomeNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="mx-auto max-w-md text-center rounded-3xl border border-border bg-card p-8 shadow-xs">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <XCircle className="size-7" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
              Event Tidak Tersedia
            </h2>
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Event yang Anda cari tidak ditemukan atau saat ini belum dipublikasikan oleh pihak penyelenggara.
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

  // 4. Server / Network Error State
  if (error) {
    return (
      <div className="min-h-svh bg-background flex flex-col justify-between">
        <HomeNavbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="mx-auto max-w-md text-center rounded-3xl border border-destructive/20 bg-destructive/5 p-8 shadow-xs">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-7" />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
              Gagal Memuat Event
            </h2>
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Terjadi kendala saat menghubungkan ke server. Silakan periksa koneksi internet Anda dan coba lagi.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-6 gap-2 rounded-2xl font-sans text-xs font-semibold"
            >
              <RefreshCw className="size-3.5" />
              <span>Coba Lagi</span>
            </Button>
          </div>
        </main>
        <HomeFooter />
      </div>
    );
  }

  // 5. Successful Event Detail Presentation
  const startSchedule = formatEventSchedule(event.startDatetime);
  const endSchedule = formatEventSchedule(event.endDatetime);
  const organizerName =
    event.organizer?.organizerProfile?.organizationName ||
    event.organizer?.fullName ||
    "Festix Verified Organizer";

  // Calculate lowest ticket price
  const ticketTypes = event.ticketTypes ?? [];
  const prices = ticketTypes
    .map((tt) => (typeof tt.price === "string" ? parseFloat(tt.price) : tt.price))
    .filter((p) => !isNaN(p));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <div className="min-h-svh bg-background flex flex-col justify-between">
      <HomeNavbar />

      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-sans text-xs text-muted-foreground">
            <Link href="/customers/home" className="hover:text-foreground transition-colors">
              Beranda
            </Link>
            <ChevronRight className="size-3.5 opacity-40" />
            <span className="hover:text-foreground transition-colors">Events</span>
            <ChevronRight className="size-3.5 opacity-40" />
            <span className="text-primary font-medium">{event.category.name}</span>
            <ChevronRight className="size-3.5 opacity-40" />
            <span className="truncate max-w-[200px] text-foreground font-semibold sm:max-w-none">
              {event.title}
            </span>
          </nav>

          {/* Hero Poster Banner */}
          <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-foreground overflow-hidden">
              {event.coverImageUrl && !imageError ? (
                <Image
                  src={event.coverImageUrl}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-[1.01]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1300px"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-foreground via-muted/30 to-foreground text-background p-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md mb-3">
                    <Ticket className="size-8" />
                  </div>
                  <h2 className="font-heading text-xl md:text-2xl font-bold max-w-lg">
                    {event.title}
                  </h2>
                  <p className="mt-1 font-sans text-xs text-background/70">
                    Official Concert Experience • Festix
                  </p>
                </div>
              )}

              {/* Gradient Scrim for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Category Pill and Share Floating on Top */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between sm:top-6 sm:left-6 sm:right-6">
                <span className="rounded-full bg-primary/90 backdrop-blur-md px-3.5 py-1.5 font-sans text-xs font-bold text-primary-foreground shadow-sm">
                  {event.category.name}
                </span>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Bagikan tautan event"
                  className="flex size-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black hover:scale-105 active:scale-95"
                >
                  <Share2 className="size-4.5" />
                </button>
              </div>

              {/* Title & Organizer Info Floating at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="max-w-3xl">
                  <h1 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
                    {event.title}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3 font-sans text-xs text-white/90">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-md font-medium">
                      <Building2 className="size-3.5 text-primary" />
                      <span>{organizerName}</span>
                      <ShieldCheck className="size-3.5 text-primary ml-0.5" />
                    </span>

                    {minPrice !== null && (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 backdrop-blur-md font-semibold text-emerald-300">
                        <span>Mulai dari {formatIDR(minPrice)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Grid: Left Details + Right Ticket Sidebar */}
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* LEFT COLUMN: Event Content & Schedule */}
            <div className="space-y-8 lg:col-span-8">
              {/* Highlight Strip: Schedule & Venue Cards */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Schedule Card */}
                <Card className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Calendar className="size-5" />
                    </div>
                    <div>
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Waktu & Tanggal
                      </span>
                      <p className="mt-1 font-heading text-sm font-bold text-foreground sm:text-base">
                        {startSchedule.dayName}, {startSchedule.fullDate}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                        <Clock className="size-3.5 text-primary" />
                        <span>Mulai {startSchedule.timeString}</span>
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Venue & Location Card */}
                <Card className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Lokasi Acara
                      </span>
                      <p className="mt-1 font-heading text-sm font-bold text-foreground sm:text-base line-clamp-1">
                        {event.location}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-muted-foreground truncate">
                        Venue Resmi Acara
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Policy & Guarantee Pills */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 font-sans text-xs font-medium text-foreground shadow-2xs">
                  {event.isRefundable ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Pengembalian Dana (Refund) Didukung</span>
                    </>
                  ) : (
                    <>
                      <Info className="size-3.5 text-muted-foreground" />
                      <span>Tiket Tidak Dapat Di-refund</span>
                    </>
                  )}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 font-sans text-xs font-medium text-foreground shadow-2xs">
                  <ShieldCheck className="size-3.5 text-primary" />
                  <span>Validasi E-Tiket Berkode QR Resmi</span>
                </span>
              </div>

              {/* Event Description Section */}
              <section className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2.5 border-b border-border pb-4">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-4" />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                    Tentang Acara Ini
                  </h2>
                </div>

                <div className="font-sans text-sm leading-relaxed text-foreground/90 whitespace-pre-line space-y-3">
                  {event.description}
                </div>
              </section>

              {/* Venue Map / Layout (if provided by organizer) */}
              {event.venueImageUrl && (
                <section className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2.5 border-b border-border pb-4">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                        Tata Letak Venue
                      </h2>
                      <p className="font-sans text-xs text-muted-foreground">
                        Panduan panggung dan penataan zona kategori tiket
                      </p>
                    </div>
                  </div>

                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-black">
                    <Image
                      src={event.venueImageUrl}
                      alt={`Venue layout ${event.title}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </section>
              )}

              {/* Concert & Event Guidelines Card */}
              <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-border pb-4">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Info className="size-4" />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                    Informasi & Ketentuan Acara
                  </h2>
                </div>

                <ul className="space-y-2.5 font-sans text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>E-tiket resmi memiliki kode QR unik yang dapat diakses di menu <strong>My Tickets</strong> setelah pembelian berhasil.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>Tunjukkan kode QR e-tiket kepada kru check-in resmi Tixora di lokasi acara untuk penukaran gelang/tanda masuk.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>Penyelenggara berhak menolak akses tiket yang telah ditukarkan sebelumnya atau terbukti tidak valid.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>Dilarang membawa senjata tajam, obat-obatan terlarang, kembang api, atau benda berbahaya lainnya ke area konser.</span>
                  </li>
                </ul>
              </section>
            </div>

            {/* RIGHT COLUMN: Ticket Tiers & Organizer Info (Sticky) */}
            <div className="space-y-6 lg:col-span-4">
              {/* Ticket Categories Box */}
              <aside className="sticky top-24 space-y-6">
                <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="border-b border-border bg-muted/40 p-5">
                    <div className="flex items-center gap-2">
                      <Ticket className="size-5 text-primary" />
                      <h3 className="font-heading text-base font-bold text-foreground">
                        Kategori Tiket
                      </h3>
                    </div>
                    <p className="mt-1 font-sans text-xs text-muted-foreground">
                      Pilihan kategori tempat duduk & festival
                    </p>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    {ticketTypes.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <Ticket className="mx-auto size-8 opacity-40 mb-2" />
                        <p className="font-sans text-xs">Informasi tiket belum tersedia untuk acara ini.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {ticketTypes.map((tier) => {
                          const isAvailable = tier.availableQuota > 0;
                          return (
                            <div
                              key={tier.id}
                              className={`flex flex-col justify-between gap-2 rounded-2xl border p-4 transition-all ${
                                isAvailable
                                  ? "border-border bg-card hover:border-primary/50 shadow-2xs"
                                  : "border-border/60 bg-muted/20 opacity-75"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-heading text-sm font-bold text-foreground">
                                    {tier.name}
                                  </h4>
                                  <span className="font-sans text-[11px] text-muted-foreground">
                                    Kategori Resmi
                                  </span>
                                </div>

                                {isAvailable ? (
                                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-sans text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    Tersedia
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-[10px] font-bold text-muted-foreground">
                                    Habis
                                  </span>
                                )}
                              </div>

                              <div className="mt-2 flex items-baseline justify-between border-t border-border/50 pt-2.5">
                                <span className="font-sans text-xs text-muted-foreground">Harga</span>
                                <span className="font-heading text-base font-bold text-primary">
                                  {formatIDR(tier.price)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Informative Read-Only Notice */}
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 text-center font-sans text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">Katalog Tiket Resmi Tixora</p>
                      <p className="mt-0.5 text-[11px]">
                        E-tiket terbit otomatis ke akun Anda setelah pembayaran tervalidasi di sistem.
                      </p>
                    </div>

                    {ticketTypes.some((tt) => tt.availableQuota > 0) && (
                      <Button
                        onClick={() => setShowBuyModal(true)}
                        className="w-full gap-2 rounded-2xl font-sans text-sm font-semibold h-11"
                      >
                        <ShoppingCart className="size-4" />
                        Beli Tiket
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Organizer Identity Card */}
                <Card className="rounded-3xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-heading font-bold text-base">
                      {organizerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Penyelenggara
                      </span>
                      <h4 className="font-heading text-sm font-bold text-foreground truncate">
                        {organizerName}
                      </h4>
                      <p className="font-sans text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="size-3" />
                        <span>Organizer Terverifikasi</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />

      <BuyTicketsModal
        event={event}
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
      />
    </div>
  );
}
