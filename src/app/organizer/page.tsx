"use client";

import { HomeNavbar } from "@/components/home/home-navbar";
import { OrganizerForm } from "@/components/organizer/organizer-form";

export default function OrganizerPage() {
  return (
    <div className="min-h-svh bg-background">
      <HomeNavbar />

      <main>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <OrganizerForm />
        </div>
      </main>
    </div>
  );
}
