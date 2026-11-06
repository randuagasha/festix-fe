"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CalendarPlus,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { API_URL } from "../../../api";

type OrganizerStatus = "PENDING" | "APPROVED" | "REJECTED";

interface OrganizerProfile {
  status: OrganizerStatus;
  rejectionReason: string | null;
}

export function OrganizerCta() {
  const router = useRouter();
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/organizer/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data: OrganizerProfile = await response.json();
          setProfile(data);
        }
      } catch {
        // no profile
      }
    }

    fetchStatus();
  }, []);

  const hasApplication = profile !== null;

  return (
    <section className="relative overflow-hidden rounded-xl bg-[#0D1B2E] p-6 text-white sm:p-8">
      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Punya event sendiri?
          </h2>

          <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-white/70 sm:text-base">
            Jadikan ide kamu sebuah pengalaman. Daftar sebagai organizer dan
            mulai buat, kelola, serta jual tiket event kamu di Tixora.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 font-sans text-xs text-white/60">
              <CalendarPlus className="size-4 text-primary" />
              Buat event
            </div>

            <div className="flex items-center gap-2 font-sans text-xs text-white/60">
              <Users className="size-4 text-primary" />
              Kelola pengunjung
            </div>
          </div>
        </div>

        {!hasApplication ? (
          <Link
            href="/organizer"
            className="group flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition-all hover:bg-primary/90"
          >
            Jadi Organizer
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : profile?.status === "APPROVED" ? (
          <Link
            href="/organizer/dashboard"
            className="group flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition-all hover:bg-primary/90"
          >
            Buka Workspace Organizer
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              className="group flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition-all hover:bg-primary/90"
            >
              Cek Status Pengajuan
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </DialogTrigger>

            <DialogPopup>
              <DialogTitle>Organizer Application</DialogTitle>

              <div className="mt-4 flex flex-col gap-3">
                {profile?.status === "PENDING" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="size-5 text-yellow-500" />
                      <span className="font-sans text-sm font-medium">
                        Status: Pending
                      </span>
                    </div>
                    <DialogDescription>
                      Your application is currently being reviewed.
                    </DialogDescription>
                  </>
                )}

                {profile?.status === "REJECTED" && (
                  <>
                    <div className="flex items-center gap-2">
                      <XCircle className="size-5 text-destructive" />
                      <span className="font-sans text-sm font-medium">
                        Status: Rejected
                      </span>
                    </div>
                    {profile.rejectionReason && (
                      <p className="font-sans text-sm text-muted-foreground">
                        {profile.rejectionReason}
                      </p>
                    )}
                    <DialogDescription>
                      You can update your information and submit a new
                      application.
                    </DialogDescription>
                    <Button
                      className="mt-2 font-sans"
                      onClick={() => {
                        setDialogOpen(false);
                        router.push("/organizer");
                      }}
                    >
                      Apply Again
                    </Button>
                  </>
                )}

                <DialogClose
                  render={<Button variant="outline" className="mt-1 font-sans" />}
                >
                  Close
                </DialogClose>
              </div>
            </DialogPopup>
          </Dialog>
        )}
      </div>
    </section>
  );
}
