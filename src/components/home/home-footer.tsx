import Link from "next/link";
import { Ticket } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/home"
              className="flex items-center gap-2 font-heading text-xl font-bold"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Ticket className="size-4" />
              </span>

              Festix<span className="text-primary">.</span>
            </Link>

            <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-muted-foreground">
              Discover events, get your tickets, and make your
              next experience count.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-3 font-sans text-sm">
            <Link
              href="/events"
              className="text-muted-foreground hover:text-foreground"
            >
              Events
            </Link>

            <Link
              href="/wishlist"
              className="text-muted-foreground hover:text-foreground"
            >
              Wishlist
            </Link>

            <Link
              href="/tickets"
              className="text-muted-foreground hover:text-foreground"
            >
              My Tickets
            </Link>

            <Link
              href="/profile"
              className="text-muted-foreground hover:text-foreground"
            >
              Profile
            </Link>

            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>

            <Link
              href="/organizer"
              className="text-muted-foreground hover:text-foreground"
            >
              Become an Organizer
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 font-sans text-xs text-muted-foreground">
          © 2026 Festix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}