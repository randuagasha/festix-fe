import { Heart, Ticket, CalendarCheck } from "lucide-react";

const stats = [
  {
    label: "Tickets",
    value: "12",
    icon: Ticket,
  },
  {
    label: "Wishlist",
    value: "8",
    icon: Heart,
  },
  {
    label: "Events attended",
    value: "7",
    icon: CalendarCheck,
  },
];

export function ProfileStats() {
  return (
    <section className="grid grid-cols-3 overflow-hidden rounded-3xl border bg-card">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center px-3 py-6 text-center ${
              index !== stats.length - 1 ? "border-r" : ""
            }`}
          >
            <Icon className="mb-2 size-5 text-primary" />

            <p className="font-heading text-xl font-bold sm:text-2xl">
              {stat.value}
            </p>

            <p className="mt-1 font-sans text-[11px] text-muted-foreground sm:text-xs">
              {stat.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}