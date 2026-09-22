"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API_URL } from "../../api";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    async function verifyAuth() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          Cookies.remove("token");
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(Boolean(token));
      }
    }

    verifyAuth();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[#eeeeee] text-black shadow-md"
          : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-10 py-4 flex items-center justify-between">
        <Link href="/landing-page" className="text-current font-heading text-xl">
          Tixora
        </Link>
        <div className="flex items-center space-x-8">
          <Link
            href="/landing-page"
            className="text-current font-sans hover:text-blue-300"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-current font-sans hover:text-blue-300"
          >
            About
          </Link>
          <Link
            href="/events"
            className="text-current font-sans hover:text-blue-300"
          >
            Events
          </Link>
          <Link
            href="/contact"
            className="text-current font-sans hover:text-blue-300"
          >
            Contact
          </Link>
          {isAuthenticated ? (
            <Link href="/customers/home">
              <Button
                variant="secondary"
                className="py-auto px-8 ml-8 bg-primary font-sans text-primary-foreground hover:bg-primary/80"
              >
                Home
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="secondary"
                className="py-auto px-8 ml-8 bg-primary font-sans text-primary-foreground hover:bg-primary/80"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
