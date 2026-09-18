"use client";

import Link from "next/link";
import {
  Heart,
  Menu,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

export function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-19 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/home"
          className="flex items-center gap-2 font-heading text-[22px] font-bold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="size-4.25" />
          </span>

          Festix<span className="text-primary">.</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <Link
            href="/home"
            className="font-sans text-sm font-medium text-foreground"
          >
            Home
          </Link>

          <Link
            href="/events"
            className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Events
          </Link>

          <Link
            href="/wishlist"
            className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Wishlist
          </Link>

          <Link
            href="/tickets"
            className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            My Tickets
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/profile"
            className="flex items-center gap-2 border-l pl-5 font-sans text-sm font-medium"
          >
            <UserRound className="size-4.5" />
            Profile
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Open menu"
        >
          {mobileOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t px-6 py-5 md:hidden">
          <nav className="flex flex-col">
            <Link
              href="/home"
              onClick={() => setMobileOpen(false)}
              className="border-b py-3 font-sans text-sm font-medium"
            >
              Home
            </Link>

            <Link
              href="/events"
              onClick={() => setMobileOpen(false)}
              className="border-b py-3 font-sans text-sm"
            >
              Events
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 border-b py-3 font-sans text-sm"
            >
              <Heart className="size-4" />
              Wishlist
            </Link>

            <Link
              href="/tickets"
              onClick={() => setMobileOpen(false)}
              className="border-b py-3 font-sans text-sm"
            >
              My Tickets
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="py-3 font-sans text-sm"
            >
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}