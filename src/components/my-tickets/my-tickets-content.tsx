"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Ticket,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Sparkles,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { fetchMyIssuedTickets } from "./tickets-api";
import { ConcertTicketCard } from "./concert-ticket-card";
import { TicketDetailModal } from "./ticket-detail-modal";
import type { IssuedTicketItem } from "./tickets-types";

type IssuedTicketTab = "all" | "upcoming" | "past";

export function MyTicketsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");

  const [tickets, setTickets] = useState<IssuedTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<IssuedTicketTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOrderIdFilter, setActiveOrderIdFilter] = useState<string | null>(
    orderIdParam
  );

  const [selectedTicket, setSelectedTicket] = useState<IssuedTicketItem | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  async function loadData(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const ticketsData = await fetchMyIssuedTickets();
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

  useEffect(() => {
    if (orderIdParam) {
      setActiveOrderIdFilter(orderIdParam);
    }
  }, [orderIdParam]);

  const now = Date.now();

  // Upcoming tickets: Event has not ended yet, and ticket is not cancelled/redeemed
  const upcomingTickets = useMemo(
    () =>
      tickets.filter((t) => {
        const eventEnd = new Date(
          t.orderItem.ticketType.event.endDatetime ||
            t.orderItem.ticketType.event.startDatetime
        ).getTime();
        return eventEnd >= now && !t.isCancelled && !t.isRedeemed;
      }),
    [tickets, now]
  );

  // Past tickets: Event has ended, or ticket has been redeemed or cancelled
  const pastTickets = useMemo(
    () =>
      tickets.filter((t) => {
        const eventEnd = new Date(
          t.orderItem.ticketType.event.endDatetime ||
            t.orderItem.ticketType.event.startDatetime
        ).getTime();
        return eventEnd < now || t.isCancelled || t.isRedeemed;
      }),
    [tickets, now]
  );

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    let list = tickets;
    if (activeTab === "upcoming") list = upcomingTickets;
    else if (activeTab === "past") list = pastTickets;

    // Filter by order ID if passed from Transactions page
    if (activeOrderIdFilter) {
      list = list.filter((t) => t.orderItem.order.id === activeOrderIdFilter);
    }

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase().trim();
    return list.filter((t) => {
      const codeMatch = t.ticketCode.toLowerCase().includes(query);
      const titleMatch = t.orderItem.ticketType.event.title
        .toLowerCase()
        .includes(query);
      const orderMatch = t.orderItem.order.orderNumber
        .toLowerCase()
        .includes(query);
      const typeMatch = t.orderItem.ticketType.name
        .toLowerCase()
        .includes(query);
      return codeMatch || titleMatch || orderMatch || typeMatch;
    });
  }, [
    tickets,
    activeTab,
    upcomingTickets,
    pastTickets,
    activeOrderIdFilter,
    searchQuery,
  ]);

  function handleSelectTicket(ticket: IssuedTicketItem) {
    setSelectedTicket(ticket);
    setDetailModalOpen(true);
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <HomeNavbar />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  <Ticket className="size-3.5" />
                  E-Tiket Terbit
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Tiket Saya
              </h1>
              <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1">
                Akses seluruh e-tiket resmi Anda yang siap digunakan untuk check-in di lokasi acara.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={loading || refreshing}
              className="gap-2 rounded-xl border-border font-medium text-xs h-9 w-fit self-start sm:self-center"
            >
              <RefreshCw
                className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Perbarui Tiket
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-muted-foreground">
                  Total E-Tiket
                </span>
                <Ticket className="size-4 text-primary" />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground mt-2">
                {tickets.length}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                Semua tiket resmi yang dimiliki
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-muted-foreground">
                  Siap Digunakan
                </span>
                <CheckCircle2 className="size-4 text-emerald-600" />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground mt-2">
                {upcomingTickets.length}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                Tiket aktif untuk event mendatang
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-muted-foreground">
                  Riwayat Event
                </span>
                <Clock3 className="size-4 text-muted-foreground" />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground mt-2">
                {pastTickets.length}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                Event yang telah selesai atau check-in
              </p>
            </div>
          </div>

          {/* Filter Banner from Order Link */}
          {activeOrderIdFilter && (
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-sans text-foreground">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-primary shrink-0" />
                <span>
                  Menampilkan tiket untuk pesanan terpilih.
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveOrderIdFilter(null);
                  router.replace("/customers/my-tickets");
                }}
                className="h-7 px-2.5 text-xs text-primary hover:text-primary/80 hover:bg-primary/15 rounded-lg"
              >
                Tampilkan Semua Tiket
                <X className="size-3.5 ml-1" />
              </Button>
            </div>
          )}

          {/* Search & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary/30 border border-border/70 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upcoming")}
                className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
                  activeTab === "upcoming"
                    ? "bg-card text-emerald-600 font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Akan Datang ({upcomingTickets.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("past")}
                className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
                  activeTab === "past"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Riwayat ({pastTickets.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari event, kode tiket..."
                className="pl-9 h-9 text-xs rounded-xl border-border bg-card"
              />
            </div>
          </div>

          {/* Content List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl bg-card border border-border animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
              <AlertCircle className="size-8 text-destructive mx-auto" />
              <h3 className="font-heading text-base font-bold text-foreground">
                Gagal Memuat E-Tiket
              </h3>
              <p className="font-sans text-xs text-muted-foreground max-w-sm mx-auto">
                Terjadi kendala saat mengambil data tiket resmi Anda. Silakan coba kembali.
              </p>
              <Button
                size="sm"
                onClick={() => loadData()}
                className="rounded-xl font-semibold text-xs bg-primary"
              >
                Coba Lagi
              </Button>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-10 sm:p-14 text-center space-y-4">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Ticket className="size-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {tickets.length === 0
                    ? "Belum Ada E-Tiket Terbit"
                    : "Tidak Ada Tiket yang Cocok"}
                </h3>
                <p className="font-sans text-xs text-muted-foreground">
                  {tickets.length === 0
                    ? "Tiket resmi akan muncul di sini secara otomatis setelah pembayaran pesanan Anda berhasil diverifikasi. Jelajahi konser dan festival seru sekarang!"
                    : "Coba ubah kata kunci pencarian atau beralih ke tab status tiket lainnya."}
                </p>
              </div>
              {tickets.length === 0 && (
                <Link href="/customers/events">
                  <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-5 gap-1.5 shadow-xs">
                    Jelajahi Event
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <ConcertTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onSelect={handleSelectTicket}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <HomeFooter />

      {/* Ticket QR Modal - PRESERVED POP-UP MODAL DESIGN */}
      <TicketDetailModal
        ticket={selectedTicket}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
}
