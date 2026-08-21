"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Tixora Event"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/20" />

      <div className="relative z-10 container mx-auto px-6 py-32 md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
          <div className="max-w-2xl">
            <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-7xl">
              Satu Klik Menuju
              <br />
              Event Impian mu.
            </h1>

            <p className="mt-7 max-w-2xl font-sans text-base leading-7 text-white/80 md:text-lg">
              Beli tiket festival dan konser musik terdekat dengan mudah, aman,
              dan terpercaya.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/events">
                <Button size="lg" className="w-full px-7 font-sans sm:w-auto">
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full px-7 font-sans text-primary-foreground sm:w-auto"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex max-w-xl items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <Search className="mr-3 h-5 w-5 text-white/70" />

              <input
                type="text"
                placeholder="Search events..."
                className="h-10 flex-1 bg-transparent font-sans text-sm text-white outline-none placeholder:text-white/60"
              />

              <Button className="rounded-full px-5 font-sans">Search</Button>
            </div>
          </div>

          <div className="relative hidden h-10 lg:block">
            <div className="absolute -right-45 top-1/2 w-200 -translate-y-1/2">
              <Image
                src="/images/mockup.png"
                alt="Tixora Mobile Application"
                width={600}
                height={1200}
                priority
                className="h-auto w-full drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
