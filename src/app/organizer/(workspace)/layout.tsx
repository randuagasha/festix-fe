"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { OrganizerSidebar } from "@/components/organizer-workspace/organizer-sidebar";
import { OrganizerTopbar } from "@/components/organizer-workspace/organizer-topbar";
import { organizerFetch, OrganizerApiError } from "@/lib/organizer-api";
import { Loader2 } from "lucide-react";

export default function OrganizerWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let ignore = false;

    async function checkApproval() {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login to access Organizer Workspace");
        router.push("/auth/login");
        return;
      }

      try {
        const orgProfile: any = await organizerFetch("/organizer/me");
        if (!ignore) {
          if (orgProfile?.status === "APPROVED") {
            setAuthorized(true);
          } else {
            toast.error("Your organizer account is not approved yet");
            router.push("/organizer");
          }
        }
      } catch (err: any) {
        if (!ignore) {
          if (err instanceof OrganizerApiError && err.status === 401) {
            router.push("/auth/login");
          } else {
            toast.error("You must apply and be approved as an organizer first");
            router.push("/organizer");
          }
        }
      }
    }

    checkApproval();

    return () => {
      ignore = true;
    };
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="font-sans text-sm text-muted-foreground">
            Verifying organizer credentials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <OrganizerSidebar />
      <SidebarInset className="min-w-0 bg-background">
        <OrganizerTopbar />
        <main className="flex-1 px-4 py-5 md:px-7 md:py-7">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
