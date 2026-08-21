"use client";

import { Search, Ticket, CreditCard } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Your Event",
    description:
      "Browse and discover concerts or events that you want to attend.",
  },
  {
    number: "02",
    icon: Ticket,
    title: "Choose Your Ticket",
    description:
      "Select the ticket category and quantity that suits you.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Complete Your Order",
    description:
      "Finish your payment and receive your digital ticket.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-sans text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Simple Process
          </p>

          <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            How It Works
          </h2>

          <p className="mt-5 font-sans text-muted-foreground">
            Getting your ticket should be simple.
          </p>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative text-center md:text-left"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground md:mx-0">
                  <Icon className="h-7 w-7" />
                </div>

                <p className="mt-6 font-sans text-sm font-medium text-primary">
                  {step.number}
                </p>

                <h3 className="mt-2 font-heading text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-muted-foreground md:max-w-none">
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