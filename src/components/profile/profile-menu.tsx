import Link from "next/link";
import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Lock,
  Settings,
  Ticket,
  UserRound,
} from "lucide-react";

const menuItems = [
  {
    title: "Personal Information",
    description: "Nama, email, lokasi, dan informasi akun",
    icon: UserRound,
    href: "/profile/edit",
  },
  {
    title: "My Tickets",
    description: "Lihat tiket dan riwayat event kamu",
    icon: Ticket,
    href: "/tickets",
  },
  {
    title: "Payment Methods",
    description: "Kelola metode pembayaran",
    icon: CreditCard,
    href: "/profile/payment",
  },
  {
    title: "Notifications",
    description: "Atur notifikasi dan pengingat event",
    icon: Bell,
    href: "/profile/notifications",
  },
  {
    title: "Security",
    description: "Password dan keamanan akun",
    icon: Lock,
    href: "/profile/security",
  },
  {
    title: "Preferences",
    description: "Atur preferensi pengalaman Festix",
    icon: Settings,
    href: "/profile/preferences",
  },
  {
    title: "Help & Support",
    description: "Butuh bantuan? Kami siap membantu",
    icon: HelpCircle,
    href: "/contact",
  },
];

export function ProfileMenu() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-heading text-xl font-bold">
          Account Settings
        </h2>

        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Kelola akun dan preferensi kamu.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-card">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60 sm:px-6 ${
                index !== menuItems.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-semibold">
                  {item.title}
                </p>

                <p className="mt-0.5 truncate font-sans text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}