"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, ShieldCheck, QrCode, Ticket } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customers/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/customers/events");
    }
  }

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Subtle background surface transition */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 70% 35%, #EBF5FF 0%, #FDFDFE 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left Column: Value Proposition & Discovery */}
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.08]">
              Satu Klik Menuju
              <br />
              <span className="text-primary">Event Impian</span> mu.
            </h1>

            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              Temukan konser musik, festival budaya, workshop, dan tiket eksklusif
              dengan proses booking instan, aman, dan 100% digital.
            </p>

            {/* Embedded Search Bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-lg items-center rounded-xl border border-border bg-white p-1.5 shadow-xs transition-all focus-within:border-primary/40 focus-within:shadow-sm"
            >
              <div className="flex flex-1 items-center gap-2.5 px-3">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari event, artis, atau kota..."
                  className="h-10 w-full bg-transparent font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <Button
                type="submit"
                size="sm"
                className="shrink-0 bg-primary font-sans text-xs font-semibold text-white hover:bg-primary/90 px-5 h-10 rounded-lg"
              >
                Cari Event
              </Button>
            </form>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/customers/events">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary font-sans text-sm font-semibold text-white hover:bg-primary/90 px-7 h-12 rounded-lg gap-2"
                >
                  Jelajahi Semua Event
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border font-sans text-sm font-medium text-foreground hover:bg-muted px-7 h-12 rounded-lg"
                >
                  Daftar Akun
                </Button>
              </Link>
            </div>

            {/* Micro Trust Points */}
            <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-border/80">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span>Tiket Resmi Terverifikasi</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <QrCode className="size-4 text-primary" />
                <span>QR Check-in Instan</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Ticket className="size-4 text-primary" />
                <span>E-Tiket Otomatis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual SaaS Event Presentation */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Main Showcase Frame */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-md transition-all hover:shadow-lg">
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted">
                <Image
                  src="/images/hero.jpg"
                  alt="Festival dan konser musik di Tixora"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2E]/90 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="rounded-md bg-white/95 px-3 py-1 font-sans text-xs font-bold text-foreground shadow-xs backdrop-blur-sm">
                    Live Event Discovery
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-sans text-xs font-medium text-white/75">
                    Pengalaman Konser & Festival
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-bold leading-snug sm:text-2xl">
                    Semua Tiket Dalam Genggamanmu
                  </h3>
                </div>
              </div>

              {/* Event Card Bottom Bar */}
              <div className="p-5 flex items-center justify-between border-t border-border bg-white">
                <div>
                  <p className="font-sans text-xs text-muted-foreground">Harga Tiket</p>
                  <p className="font-heading text-base font-bold text-primary">
                    Mulai Rp 100.000
                  </p>
                </div>

                <Link href="/customers/events">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted font-sans text-xs font-semibold px-4"
                  >
                    Beli Tiket
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
