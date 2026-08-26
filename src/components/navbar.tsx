"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);

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
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full border-none bg-transparent p-0 hover:bg-transparent focus:outline-none">
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0"
                >
                  <Avatar>
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    johndoe@example.com
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login ">
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
