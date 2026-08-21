"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-[#eeeeee] px-6 py-24 md:px-10">
      <div className="container mx-auto">
        <div className="overflow-hidden rounded-3xl bg-foreground px-7 py-16 text-background md:px-16 md:py-20">
          <div className="max-w-3xl">
            <p className="font-sans text-sm font-medium uppercase tracking-[0.25em] text-primary">
              Your Next Experience
            </p>

            <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight md:text-6xl">
              Ready for your
              <br />
              next event?
            </h2>

            <p className="mt-6 max-w-xl font-sans leading-7 text-background/70">
              Discover your next unforgettable experience and get your ticket
              with Tixora.
            </p>

            <div className="mt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="px-7 font-sans"
                >
                  Buat Akun
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}