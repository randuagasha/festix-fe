"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StaffSidebar } from "@/components/staff/staff-sidebar";
import { StaffTopbar } from "@/components/staff/staff-topbar";
import { StaffProfileModal } from "@/components/staff/staff-profile-modal";
import { QrScannerModal } from "@/components/staff/qr-scanner-modal";
import { getMe, type CurrentUser } from "@/lib/auth-api";

type StaffWorkspaceContextType = {
  user: CurrentUser | null;
  openScanner: (preferredEventId?: string) => void;
  refreshKey: number;
  triggerRefresh: () => void;
};

const StaffWorkspaceContext = createContext<StaffWorkspaceContextType>({
  user: null,
  openScanner: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

export function useStaffWorkspace() {
  return useContext(StaffWorkspaceContext);
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [preferredEventId, setPreferredEventId] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please sign in to access staff workspace");
        router.push("/auth/login");
        return;
      }

      const currentUser = await getMe();
      if (!active) return;

      if (!currentUser) {
        toast.error("Session expired, please sign in again");
        router.push("/auth/login");
        return;
      }

      if (currentUser.role !== "STAFF" && currentUser.role !== "ADMIN") {
        toast.error("Access denied: Staff workspace is restricted to operational staff");
        router.push("/customers/home");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  function handleLogout() {
    Cookies.remove("token");
    toast.success("Signed out successfully");
    router.push("/auth/login");
  }

  function openScanner(eventId?: string) {
    setPreferredEventId(eventId);
    setScannerOpen(true);
  }

  function triggerRefresh() {
    setRefreshKey((k) => k + 1);
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-sans text-xs text-muted-foreground">
            Verifying staff credentials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <StaffWorkspaceContext.Provider
      value={{
        user,
        openScanner,
        refreshKey,
        triggerRefresh,
      }}
    >
      <SidebarProvider>
        <StaffSidebar
          user={user}
          onOpenProfile={() => setProfileOpen(true)}
          onLogout={handleLogout}
          onOpenScanner={() => openScanner()}
        />

        <SidebarInset>
          <StaffTopbar
            user={user}
            onOpenProfile={() => setProfileOpen(true)}
            onOpenScanner={() => openScanner()}
          />

          <main className="flex-1 px-4 py-5 md:px-7 md:py-7">
            {children}
          </main>
        </SidebarInset>

        <StaffProfileModal
          open={profileOpen}
          onOpenChange={setProfileOpen}
          user={user}
          onLogout={handleLogout}
        />

        <QrScannerModal
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          preferredEventId={preferredEventId}
          onRedemptionSuccess={triggerRefresh}
        />
      </SidebarProvider>
    </StaffWorkspaceContext.Provider>
  );
}
