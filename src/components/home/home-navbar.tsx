"use client";

import Link from "next/link";
import {
  Heart,
  LayoutDashboard,
  Menu,
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

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-19 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/customers/home"
          className="flex items-center gap-2 font-heading text-[22px] font-bold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="size-4.25" />
          </span>

          Festix<span className="text-primary">.</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <Link
            href="/customers/home"
            className={`font-sans text-sm transition-colors hover:text-foreground ${
              pathname === "/customers/home"
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Home
          </Link>

          <Link
            href="/customers/events"
            className={`font-sans text-sm transition-colors hover:text-foreground ${
              pathname === "/customers/events" ? "font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            Events
          </Link>

          <Link
            href="/wishlist"
            className={`font-sans text-sm transition-colors hover:text-foreground ${
              pathname === "/wishlist" ? "font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            Wishlist
          </Link>

          <Link
            href="/customers/my-tickets"
            className={`font-sans text-sm transition-colors hover:text-foreground ${
              pathname === "/customers/my-tickets"
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            }`}
          >
            My Tickets
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user?.role === "ADMIN" && (
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href="/admin/dashboard" />}
            >
              <LayoutDashboard className="size-3.5" />
              Admin Dashboard
            </Button>
          )}
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
              href="/customers/home"
              onClick={() => setMobileOpen(false)}
              className="border-b py-3 font-sans text-sm font-medium"
            >
              Home
            </Link>

            <Link
              href="/customers/events"
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
              href="/customers/my-tickets"
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