"use client";

import { Zap, ShieldCheck, Ticket, CreditCard } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Booking Cepat & Mudah",
    description:
      "Temukan event dan selesaikan pembelian tiket hanya dalam beberapa langkah tanpa ribet.",
  },
  {
    icon: ShieldCheck,
    title: "Transaksi 100% Aman",
    description:
      "Setiap pembayaran diproses melalui payment gateway terenkripsi dengan proteksi penuh.",
  },
  {
    icon: Ticket,
    title: "E-Tiket & QR Code Resmi",
    description:
      "Tiket digital dengan QR code unik langsung terbit dan tersimpan di akun Anda untuk check-in.",
  },
  {
    icon: CreditCard,
    title: "Metode Pembayaran Luas",
    description:
      "Mendukung berbagai metode pembayaran mulai dari Virtual Account hingga dompet digital.",
  },
];

export function WhyTixora() {
  return (
    <section className="bg-white py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Kenapa Memilih Tixora
          </h2>
          <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed">
            Platform ticketing modern yang dirancang untuk memberikan pengalaman
            terbaik bagi pengunjung maupun penyelenggara event.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
              >
                <div>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 font-heading text-base font-bold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
