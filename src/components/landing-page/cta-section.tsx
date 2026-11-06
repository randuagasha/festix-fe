"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-white py-16 px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-[#0D1B2E] px-8 py-16 md:px-16 md:py-20 text-white shadow-lg">
          {/* Subtle geometric wash */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 25%, #0099FF 0%, transparent 45%), radial-gradient(circle at 15% 85%, #38BDF8 0%, transparent 40%)",
            }}
          />

          <div className="relative z-10 max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-tight text-white">
              Siap untuk event
              <br />
              berikutnya?
            </h2>

            <p className="mt-4 font-sans text-sm md:text-base leading-relaxed text-white/70 max-w-xl">
              Bergabung bersama ribuan penikmat konser dan festival. Beli tiket dengan
              mudah, nikmati e-tiket instan, dan buat setiap momen berharga.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 font-sans text-sm font-semibold px-7 h-12 rounded-lg gap-2"
                >
                  Buat Akun Gratis
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <Link href="/customers/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-sans text-sm font-medium px-7 h-12 rounded-lg"
                >
                  Jelajahi Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
