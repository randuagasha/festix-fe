"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Receipt,
  Search,
  RefreshCw,
  AlertCircle,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { fetchCustomerTransactions } from "./transactions-api";
import { TransactionCard } from "./transaction-card";
import { TransactionDetailModal } from "./transaction-detail-modal";
import type {
  CustomerTransaction,
  TransactionFilterTab,
} from "./transactions-types";

export function TransactionsContent() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TransactionFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTransaction, setSelectedTransaction] =
    useState<CustomerTransaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  async function loadData(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchCustomerTransactions();
      setTransactions(data);
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

  const now = Date.now();

  const pendingList = useMemo(
    () =>
      transactions.filter(
        (t) =>
          t.paymentStatus === "PENDING" &&
          new Date(t.expiresAt).getTime() > now
      ),
    [transactions, now]
  );

  const paidList = useMemo(
    () => transactions.filter((t) => t.paymentStatus === "PAID"),
    [transactions]
  );

  const expiredList = useMemo(
    () =>
      transactions.filter(
        (t) =>
          t.paymentStatus === "EXPIRED" ||
          t.paymentStatus === "FAILED" ||
          (t.paymentStatus === "PENDING" &&
            new Date(t.expiresAt).getTime() <= now)
      ),
    [transactions, now]
  );

  const filteredTransactions = useMemo(() => {
    let list = transactions;
    if (activeTab === "pending") list = pendingList;
    else if (activeTab === "paid") list = paidList;
    else if (activeTab === "expired") list = expiredList;

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase().trim();
    return list.filter((t) => {
      const orderMatch = t.orderNumber.toLowerCase().includes(query);
      const eventTitle = t.orderItems[0]?.ticketType?.event?.title || "";
      const eventMatch = eventTitle.toLowerCase().includes(query);
      return orderMatch || eventMatch;
    });
  }, [transactions, activeTab, pendingList, paidList, expiredList, searchQuery]);

  function handleOpenDetails(tx: CustomerTransaction) {
    setSelectedTransaction(tx);
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
                  <Receipt className="size-3.5" />
                  Riwayat Pesanan
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Daftar Transaksi
              </h1>
              <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1">
                Pantau seluruh status pembelian dan pembayaran tiket event Anda di satu tempat.
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
              Perbarui Data
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-muted-foreground">
                  Total Transaksi
                </span>
                <Receipt className="size-4 text-primary" />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground mt-2">
                {transactions.length}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                Semua pesanan yang pernah dibuat
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-muted-foreground">
                  Pembayaran Berhasil
                </span>
                <CheckCircle2 className="size-4 text-emerald-600" />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground mt-2">
                {paidList.length}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                Tiket resmi telah diterbitkan
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-muted-foreground">
                  Menunggu Pembayaran
                </span>
                <Clock3 className="size-4 text-amber-500" />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground mt-2">
                {pendingList.length}
              </p>
              <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                Selesaikan sebelum batas waktu habis
              </p>
            </div>
          </div>

          {/* Search & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-secondary/30 border border-border/70 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
                  activeTab === "pending"
                    ? "bg-card text-amber-600 font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Menunggu ({pendingList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("paid")}
                className={`px-3 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
                  activeTab === "paid"
                    ? "bg-card text-emerald-600 font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Lunas ({paidList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("expired")}
                className={`px-3 py-1.5 rounded-xl font-sans text-xs font-medium transition-all ${
                  activeTab === "expired"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Kadaluarsa / Gagal ({expiredList.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari event atau nomor order..."
                className="pl-9 h-9 text-xs rounded-xl border-border bg-card"
              />
            </div>
          </div>

          {/* List Content */}
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
                Gagal Memuat Transaksi
              </h3>
              <p className="font-sans text-xs text-muted-foreground max-w-sm mx-auto">
                Terjadi kesalahan saat mengambil riwayat transaksi. Silakan coba kembali.
              </p>
              <Button
                size="sm"
                onClick={() => loadData()}
                className="rounded-xl font-semibold text-xs bg-primary"
              >
                Coba Lagi
              </Button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-10 sm:p-14 text-center space-y-4">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Receipt className="size-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {transactions.length === 0
                    ? "Belum Ada Transaksi"
                    : "Tidak Ada Transaksi yang Cocok"}
                </h3>
                <p className="font-sans text-xs text-muted-foreground">
                  {transactions.length === 0
                    ? "Anda belum pernah melakukan pemesanan tiket event. Jelajahi berbagai konser dan festival seru di Tixora!"
                    : "Coba ubah kata kunci pencarian atau ganti filter status transaksi di atas."}
                </p>
              </div>
              {transactions.length === 0 && (
                <Link href="/customers/events">
                  <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-5 gap-1.5 shadow-xs">
                    Jelajahi Event
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  onViewDetails={handleOpenDetails}
                  hasTickets={tx.paymentStatus === "PAID"}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <HomeFooter />

      {/* Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        hasTickets={selectedTransaction?.paymentStatus === "PAID"}
      />
    </div>
  );
}
