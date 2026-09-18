"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProfileDangerZone() {
  const handleLogout = () => {
    toast("Logout", {
      description: "Logic logout akan dihubungkan ke backend.",
    });
  };

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-destructive/20 bg-destructive/3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h2 className="font-heading text-base font-bold">
          Sign out
        </h2>

        <p className="mt-1 font-sans text-xs leading-5 text-muted-foreground">
          Keluar dari akun Festix kamu di perangkat ini.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full font-sans text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </section>
  );
}