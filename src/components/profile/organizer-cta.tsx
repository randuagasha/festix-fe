import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  Sparkles,
  Users,
} from "lucide-react";

export function OrganizerCta() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-foreground p-6 text-background sm:p-8">
      <div className="absolute -right-20 -top-20 size-56 rounded-full bg-primary/20 blur-3xl" />

      <div className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>

          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Punya event sendiri?
          </h2>

          <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-background/65 sm:text-base">
            Jadikan ide kamu sebuah pengalaman. Daftar sebagai organizer dan
            mulai buat, kelola, serta jual tiket event kamu di Festix.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 font-sans text-xs text-background/60">
              <CalendarPlus className="size-4 text-primary" />
              Create events
            </div>

            <div className="flex items-center gap-2 font-sans text-xs text-background/60">
              <Users className="size-4 text-primary" />
              Manage attendees
            </div>
          </div>
        </div>

        <Link
          href="/organizer"
          className="group flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-sans text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          Become an Organizer

          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}