"use client";

import { ProfileHeader } from "@/components/profile/profile-header";
import { OrganizerCta } from "@/components/profile/organizer-cta";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileMenu } from "@/components/profile/profile-menu";
import { ProfileDangerZone } from "@/components/profile/profile-danger-zone";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";

export function ProfilePage() {
  return (
    <div className="min-h-svh bg-background">
      <HomeNavbar />

      <main>
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-12">
          <div className="space-y-6">
            <ProfileHeader />

            <ProfileStats />

            <OrganizerCta />

            <ProfileMenu />

            <ProfileDangerZone />
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}