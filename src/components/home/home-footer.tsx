import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/customers/home"
              className="font-heading text-xl font-bold text-foreground"
            >
              Tixora<span className="text-primary">.</span>
            </Link>

            <p className="mt-3 max-w-xs font-sans text-sm leading-6 text-muted-foreground">
              Temukan event, dapatkan tiketmu, dan jadikan pengalaman berikutnya
              tak terlupakan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-3 font-sans text-sm">
            <Link
              href="/customers/events"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Events
            </Link>

            <Link
              href="/customers/my-tickets"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Tiket Saya
            </Link>

            <Link
              href="/profile"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Profil
            </Link>

            <Link
              href="/organizer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Jadi Organizer
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 font-sans text-xs text-muted-foreground">
          &copy; 2026 Tixora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
