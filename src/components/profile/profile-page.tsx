"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { OrganizerCta } from "@/components/profile/organizer-cta";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileMenu } from "@/components/profile/profile-menu";
import { ProfileDangerZone } from "@/components/profile/profile-danger-zone";
import { PersonalInfoModal } from "@/components/profile/personal-info-modal";
import { SecurityModal } from "@/components/profile/security-modal";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { getMe, type CurrentUser } from "@/lib/auth-api";

export function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      const current = await getMe();
      if (!ignore) {
        if (!current) {
          router.push("/auth/login");
          return;
        }
        if (current.role === "STAFF") {
          router.push("/staff/dashboard");
          return;
        }
        setUser(current);
        setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [router]);

  return (
    <div className="min-h-svh bg-background">
      <HomeNavbar />

      <main>
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-12">
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-3xl border bg-card">
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <ProfileHeader
                user={user}
                onUserUpdate={(updated) => setUser(updated)}
              />
            )}

            <ProfileStats />

            <OrganizerCta />

            <ProfileMenu
              onOpenPersonalInfo={() => setPersonalInfoOpen(true)}
              onOpenSecurity={() => setSecurityOpen(true)}
            />

            <ProfileDangerZone />

            <PersonalInfoModal
              open={personalInfoOpen}
              onOpenChange={setPersonalInfoOpen}
              user={user}
              onUserUpdate={(updated) => setUser(updated)}
            />

            <SecurityModal
              open={securityOpen}
              onOpenChange={setSecurityOpen}
              user={user}
            />
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}