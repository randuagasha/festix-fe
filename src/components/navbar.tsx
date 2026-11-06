"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { LayoutDashboard, Menu, X, ArrowRight } from "lucide-react";
import { getMe, type CurrentUser } from "@/lib/auth-api";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    async function verifyAuth() {
      const userData = await getMe();
      setUser(userData);
      setIsAuthenticated(Boolean(userData));
    }

    verifyAuth();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        isScrolled
          ? "bg-[#FDFDFE]/95 backdrop-blur-md border-border shadow-xs"
          : "bg-[#FDFDFE]/80 backdrop-blur-xs border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/landing-page"
            className="font-heading text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            Tixora<span className="text-primary">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/landing-page"
              className="font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Beranda
            </Link>
            <Link
              href="/customers/events"
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Jelajahi Event
            </Link>
            <Link
              href="/organizer"
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Untuk Organizer
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === "ADMIN" && (
                <Link href="/admin/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 font-sans text-xs font-semibold border-border hover:bg-muted"
                  >
                    <LayoutDashboard className="size-3.5" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/customers/home">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-xs font-semibold px-4 gap-1.5"
                >
                  Masuk ke App
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/register">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-sans text-xs font-medium text-foreground hover:bg-muted"
                >
                  Daftar
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-xs font-semibold px-4"
                >
                  Masuk
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-foreground hover:bg-muted md:hidden transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-white px-6 py-5 shadow-md">
          <div className="flex flex-col gap-3 font-sans text-sm">
            <Link
              href="/landing-page"
              onClick={() => setMobileOpen(false)}
              className="font-medium text-foreground py-1.5"
            >
              Beranda
            </Link>
            <Link
              href="/customers/events"
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground py-1.5"
            >
              Jelajahi Event
            </Link>
            <Link
              href="/organizer"
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground py-1.5"
            >
              Untuk Organizer
            </Link>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <Link href="/customers/home" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full bg-primary text-primary-foreground font-sans">
                    Masuk ke App
                  </Button>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full font-sans border-border">
                      Daftar
                    </Button>
                  </Link>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full bg-primary text-primary-foreground font-sans">
                      Masuk
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
