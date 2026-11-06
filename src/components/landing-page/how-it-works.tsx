"use client";

import { Search, Ticket, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Cari Event Impian",
    description:
      "Jelajahi konser, festival musik, atau seminar sesuai minat dan kotamu.",
  },
  {
    number: "02",
    icon: Ticket,
    title: "Pilih Tiket & Jumlah",
    description:
      "Tentukan kategori tiket yang sesuai dan atur jumlah tiket yang ingin dibeli.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Bayar & Dapatkan E-Tiket",
    description:
      "Selesaikan pembayaran instan dan QR code e-tiket Anda siap digunakan saat check-in.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#F0F8FF]/60 py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cara Kerja Tixora
          </h2>
          <p className="mt-3 font-sans text-sm text-muted-foreground">
            Tiga langkah mudah untuk menghadiri event favoritmu tanpa antre.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col rounded-xl border border-border bg-white p-7 shadow-xs transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-heading text-2xl font-extrabold text-primary/30">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-2.5 font-sans text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
