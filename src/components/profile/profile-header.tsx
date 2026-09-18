"use client";

import { Camera, Mail, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileHeader() {
  return (
    <section className="overflow-hidden rounded-3xl border bg-card">
      <div className="h-28 bg-primary/10 sm:h-36" />

      <div className="px-5 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative">
              <div className="flex size-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-card bg-muted sm:size-32">
                <span className="font-heading text-4xl font-bold text-primary">
                  JD
                </span>
              </div>

              <button
                type="button"
                className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted"
                aria-label="Change profile picture"
              >
                <Camera className="size-4" />
              </button>
            </div>

            <div className="pb-1">
              <h2 className="font-heading text-2xl font-bold">
                John Doe
              </h2>

              <p className="mt-1 font-sans text-sm text-muted-foreground">
                @johndoe
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full font-sans sm:w-auto"
          >
            <Pencil className="size-4" />
            Edit Profile
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:flex-wrap sm:gap-6">
          <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
            <Mail className="size-4 text-primary" />
            johndoe@example.com
          </div>

          <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            Jakarta, Indonesia
          </div>
        </div>
      </div>
    </section>
  );
}