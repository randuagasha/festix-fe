"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Menu,
  Receipt,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getMe, type CurrentUser } from "@/lib/auth-api";

export function HomeNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  const isHomeActive = pathname === "/customers/home";
  const isEventsActive =
    pathname === "/customers/events" || pathname.startsWith("/customers/events/");
  const isTicketsActive =
    pathname === "/customers/my-tickets" ||
    pathname.startsWith("/customers/my-tickets/");
  const isTransactionsActive =
    pathname === "/customers/transactions" ||
    pathname.startsWith("/customers/transactions/");
  const isProfileActive =
    pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/customers/home"
          className="font-heading text-xl font-bold text-foreground"
        >
          Tixora<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/customers/home"
            className={`font-sans text-sm transition-colors hover:text-foreground ${
              isHomeActive
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Home
          </Link>

          <Link
            href="/customers/events"
            className={`font-sans text-sm transition-colors hover:text-foreground ${
              isEventsActive
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Events
          </Link>

          <Link
            href="/customers/my-tickets"
            className={`font-sans text-sm transition-colors hover:text-foreground ${
              isTicketsActive
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            My Tickets
          </Link>

          <Link
            href="/customers/transactions"
            className={`font-sans text-sm transition-colors hover:text-foreground ${
              isTransactionsActive
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Transactions
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user?.role === "ADMIN" && (
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href="/admin/dashboard" />}
              className="border-border text-foreground hover:bg-muted font-sans"
            >
              <LayoutDashboard className="size-3.5" />
              Admin
            </Button>
          )}
          <Link
            href="/profile"
            className={`flex items-center gap-2 border-l border-border pl-4 font-sans text-sm font-medium transition-colors ${
              isProfileActive
                ? "font-semibold text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            <UserRound className="size-4" />
            Profile
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-foreground hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          {mobileOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-6 py-4 md:hidden bg-white">
          <nav className="flex flex-col gap-1">
            <Link
              href="/customers/home"
              onClick={() => setMobileOpen(false)}
              className={`py-2.5 font-sans text-sm font-medium transition-colors ${
                isHomeActive ? "font-semibold text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>

            <Link
              href="/customers/events"
              onClick={() => setMobileOpen(false)}
              className={`py-2.5 font-sans text-sm transition-colors ${
                isEventsActive
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Events
            </Link>

            <Link
              href="/customers/my-tickets"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 py-2.5 font-sans text-sm transition-colors ${
                isTicketsActive
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Ticket className="size-4" />
              My Tickets
            </Link>

            <Link
              href="/customers/transactions"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 py-2.5 font-sans text-sm transition-colors ${
                isTransactionsActive
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Receipt className="size-4" />
              Transactions
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 py-2.5 font-sans text-sm transition-colors ${
                isProfileActive
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserRound className="size-4" />
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
