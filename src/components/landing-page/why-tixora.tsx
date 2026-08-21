"use client";

import {
  CreditCard,
  ShieldCheck,
  Ticket,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Easy Booking",
    description:
      "Find and book your favorite events through a simple and straightforward experience.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description:
      "Complete your transaction through a secure and reliable payment process.",
  },
  {
    icon: Ticket,
    title: "Digital Ticket",
    description:
      "Keep your tickets accessible digitally and ready whenever you need them.",
  },
  {
    icon: CreditCard,
    title: "Simple Checkout",
    description:
      "Choose your ticket, complete your payment, and get ready for the event.",
  },
];

export function WhyTixora() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-sans text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Why Tixora
          </p>

          <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Everything You Need
            <br />
            For Your Next Event.
          </h2>

          <p className="mt-5 font-sans leading-7 text-muted-foreground">
            From discovering an event to getting your ticket, Tixora makes
            every step simple.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border bg-background p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="mt-6 font-heading text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 font-sans text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}