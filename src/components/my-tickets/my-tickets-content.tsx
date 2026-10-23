"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  QrCode,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { fetchMyOrders, fetchMyIssuedTickets } from "./tickets-api";
import { TicketDetailModal } from "./ticket-detail-modal";
import type {
  CustomerOrder,
  IssuedTicketItem,
  TicketFilterTab,
} from "./tickets-types";

function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
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

export function MyTicketsContent() {
  const router = useRouter();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [tickets, setTickets] = useState<IssuedTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TicketFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTicket, setSelectedTicket] = useState<IssuedTicketItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  async function loadData(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [ordersData, ticketsData] = await Promise.all([
        fetchMyOrders(),
        fetchMyIssuedTickets(),
      ]);
      setOrders(ordersData);
      setTickets(ticketsData);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "UNAUTHENTICATED") {
        router.push("/auth/login");
        return;
      }
      setError("FAILED_TO_LOAD");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const ticketsByOrder = useMemo(() => {
    const map = new Map<string, IssuedTicketItem[]>();
    for (const t of tickets) {
      const orderId = t.orderItem.order.id;
      if (!map.has(orderId)) {
        map.set(orderId, []);
      }
      map.get(orderId)!.push(t);
    }
    return map;
  }, [tickets]);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.paymentStatus === "PENDING"),
    [orders]
  );
  const paidOrders = useMemo(
    () => orders.filter((o) => o.paymentStatus === "PAID"),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (activeTab === "pending") list = pendingOrders;
    else if (activeTab === "paid") list = paidOrders;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter((order) => {
      const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
      const matchEvent = order.orderItems.some((oi) =>
        oi.ticketType.event.title.toLowerCase().includes(q)
      );
      const matchTicketType = order.orderItems.some((oi) =>
        oi.ticketType.name.toLowerCase().includes(q)
      );
      return matchOrderNum || matchEvent || matchTicketType;
    });
  }, [orders, activeTab, pendingOrders, paidOrders, searchQuery]);

  function handleOpenTicket(ticket: IssuedTicketItem) {
    setSelectedTicket(ticket);
    setDetailModalOpen(true);
  }

  return (
    <div className="min-h-svh bg-background flex flex-col justify-between">
      <HomeNavbar />

      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-8">
          {/* Header Title & Refresh Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Ticket className="size-5" />
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Tiket Saya
                </h1>
              </div>
              <p className="mt-1 font-sans text-xs sm:text-sm text-muted-foreground">
                Kelola seluruh pesanan tiket dan akses QR code e-tiket resmi Anda di sini
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={loading || refreshing}
              className="gap-2 rounded-2xl font-sans text-xs font-semibold self-start sm:self-auto"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Memperbarui..." : "Perbarui Status"}</span>
            </Button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
              <span className="font-sans text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Total Pesanan
              </span>
              <p className="font-heading text-2xl font-bold text-foreground mt-1">
                {orders.length}
              </p>
            </Card>

            <Card className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
              <span className="font-sans text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                Menunggu Pembayaran
              </span>
              <p className="font-heading text-2xl font-bold text-foreground mt-1">
                {pendingOrders.length}
              </p>
            </Card>

            <Card className="rounded-2xl border border-border bg-card p-4 shadow-2xs">
              <span className="font-sans text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                Tiket Diterbitkan
              </span>
              <p className="font-heading text-2xl font-bold text-foreground mt-1">
                {tickets.length}
              </p>
            </Card>
          </div>

          {/* Filter Tabs and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="inline-flex rounded-2xl border border-border bg-muted/40 p-1 self-start">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold transition-all ${
                  activeTab === "all"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold transition-all ${
                  activeTab === "pending"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Menunggu Bayar ({pendingOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("paid")}
                className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold transition-all ${
                  activeTab === "paid"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sudah Bayar ({paidOrders.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari event atau nomor order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-2xl text-xs h-10 border-border bg-card"
              />
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-56 rounded-3xl bg-muted/60" />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Gagal Memuat Tiket
              </h3>
              <p className="font-sans text-xs text-muted-foreground max-w-sm mx-auto">
                Terjadi kendala saat mengambil data tiket Anda dari server. Silakan periksa koneksi internet Anda.
              </p>
              <Button
                onClick={() => loadData()}
                variant="outline"
                className="gap-2 rounded-2xl font-sans text-xs font-semibold"
              >
                <RefreshCw className="size-3.5" />
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-4">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Ticket className="size-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Belum Ada Tiket yang Ditemukan
              </h3>
              <p className="font-sans text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                {activeTab === "pending"
                  ? "Tidak ada transaksi yang sedang menunggu pembayaran."
                  : activeTab === "paid"
                    ? "Anda belum memiliki tiket acara resmi yang aktif."
                    : "Anda belum melakukan pemesanan tiket apa pun. Jelajahi event menarik di katalog kami."}
              </p>
              <Link
                href="/customers/home"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/95"
              >
                <span>Jelajahi Event Sekarang</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}

          {/* Order / Ticket List */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const isPending = order.paymentStatus === "PENDING";
                const isPaid = order.paymentStatus === "PAID";
                const isExpired = order.paymentStatus === "EXPIRED";
                const isFailed = order.paymentStatus === "FAILED";

                const firstItem = order.orderItems[0];
                const event = firstItem?.ticketType.event;
                const schedule = event ? formatSchedule(event.startDatetime) : null;
                const orderIssuedTickets = ticketsByOrder.get(order.id) || [];

                return (
                  <Card
                    key={order.id}
                    className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs transition-all hover:border-primary/30"
                  >
                    {/* Order Top Bar: Order Number, Date, Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3 sm:px-6">
                      <div className="flex items-center gap-2.5 font-sans text-xs">
                        <span className="font-bold text-foreground">
                          {order.orderNumber}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {isPaid && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-sans text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            Pembayaran Berhasil
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 font-sans text-xs font-bold text-amber-600 dark:text-amber-400">
                            <Clock3 className="size-3.5" />
                            Menunggu Pembayaran
                          </span>
                        )}
                        {isExpired && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-sans text-xs font-bold text-muted-foreground">
                            <XCircle className="size-3.5" />
                            Kedaluwarsa
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 font-sans text-xs font-bold text-red-600 dark:text-red-400">
                            <XCircle className="size-3.5" />
                            Gagal
                          </span>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-5 sm:p-6 space-y-6">
                      {/* Event Overview Section */}
                      {event && (
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
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
                            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground line-clamp-1">
                              {event.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs text-muted-foreground">
                              {schedule && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="size-3.5 text-primary" />
                                  <span>{schedule.dayName}, {schedule.fullDate}</span>
                                </span>
                              )}
                              {schedule && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="size-3.5 text-primary" />
                                  <span>{schedule.timeString}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1.5">
                                <MapPin className="size-3.5 text-primary" />
                                <span className="truncate max-w-[200px]">{event.location}</span>
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1 font-sans text-xs">
                              {order.orderItems.map((item) => (
                                <span
                                  key={item.id}
                                  className="rounded-full bg-muted/60 border border-border px-3 py-0.5 font-medium text-foreground"
                                >
                                  {item.ticketType.name} ({item.quantity}x)
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Total Price Display */}
                          <div className="text-left sm:text-right self-stretch sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                            <span className="font-sans text-[11px] text-muted-foreground block">
                              Total Pesanan
                            </span>
                            <span className="font-heading text-lg font-bold text-primary block mt-0.5">
                              {formatIDR(order.totalAmount)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* State Specific Blocks */}
                      {/* PENDING ORDER: Continue Payment Button */}
                      {isPending && (
                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="font-sans text-xs text-muted-foreground space-y-0.5">
                            <p className="font-semibold text-foreground">
                              Selesaikan Pembayaran Anda
                            </p>
                            <p>
                              Batas waktu pembayaran berlaku. Klik tombol di samping untuk melanjutkan transaksi ke Xendit.
                            </p>
                          </div>

                          {order.paymentUrl ? (
                            <Button
                              type="button"
                              onClick={() => {
                                if (order.paymentUrl) window.location.href = order.paymentUrl;
                              }}
                              className="gap-2 rounded-xl font-sans text-xs font-semibold h-10 px-5 shrink-0 bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              <span>Lanjutkan Pembayaran</span>
                              <ExternalLink className="size-3.5" />
                            </Button>
                          ) : (
                            <span className="font-sans text-xs text-muted-foreground italic">
                              Tautan pembayaran tidak tersedia
                            </span>
                          )}
                        </div>
                      )}

                      {/* EXPIRED / FAILED MESSAGE */}
                      {(isExpired || isFailed) && (
                        <div className="rounded-2xl border border-border bg-muted/20 p-4 font-sans text-xs text-muted-foreground">
                          {isExpired
                            ? "Waktu pembayaran untuk pesanan ini telah habis. Kuota tiket telah dikembalikan secara otomatis ke sistem."
                            : "Pembayaran untuk transaksi ini dibatalkan atau gagal diproses oleh gateway."}
                        </div>
                      )}

                      {/* PAID ORDER: Display Individual Issued Tickets with QR entry */}
                      {isPaid && (
                        <div className="space-y-3 pt-2">
                          <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                            E-Tiket Resmi ({orderIssuedTickets.length} Tiket)
                          </span>

                          {orderIssuedTickets.length === 0 ? (
                            <p className="font-sans text-xs text-muted-foreground italic">
                              Tiket sedang diproses oleh sistem. Silakan klik Perbarui Status.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {orderIssuedTickets.map((t) => (
                                <div
                                  key={t.id}
                                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/20 p-3.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
                                >
                                  <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <QrCode className="size-4 text-primary shrink-0" />
                                      <span className="font-mono text-xs font-bold text-foreground truncate">
                                        {t.ticketCode}
                                      </span>
                                    </div>
                                    <p className="font-sans text-[11px] text-muted-foreground">
                                      {t.orderItem.ticketType.name} •{" "}
                                      {t.isCancelled
                                        ? "Dibatalkan"
                                        : t.isRedeemed
                                          ? "Telah Di-redeem"
                                          : "Belum Digunakan"}
                                    </p>
                                  </div>

                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleOpenTicket(t)}
                                    className="gap-1.5 rounded-xl font-sans text-xs font-semibold h-8 px-3 shrink-0"
                                  >
                                    <QrCode className="size-3.5" />
                                    <span>Buka E-Tiket</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <HomeFooter />

      {/* Ticket QR Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
}
