"use client";

import { usePathname } from "next/navigation";
import { QrCode, ShieldCheck } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CurrentUser } from "@/lib/auth-api";

const pageTitles: Record<string, string> = {
  "/staff/dashboard": "Operational Overview",
  "/staff/events": "My Assigned Events",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/staff/events/")) return "Event Redemption Dashboard";
  return "Staff Workspace";
}

type StaffTopbarProps = {
  user: CurrentUser | null;
  onOpenProfile: () => void;
  onOpenScanner: () => void;
};

export function StaffTopbar({
  user,
  onOpenProfile,
  onOpenScanner,
}: StaffTopbarProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Staff");
  const userInitial = displayName.charAt(0).toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <Separator orientation="vertical" className="h-4 md:hidden" />
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-sm font-semibold tracking-tight md:text-base">
            {pageTitle}
          </h1>
          <span className="hidden items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-sans text-[11px] font-medium text-primary sm:inline-flex">
            <ShieldCheck className="size-3" />
            Staff
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          onClick={onOpenScanner}
          size="sm"
          className="gap-1.5 shadow-xs"
        >
          <QrCode className="size-4" />
          <span className="hidden sm:inline">Scan Ticket</span>
        </Button>

        <button
          type="button"
          onClick={onOpenProfile}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-card p-1 shadow-xs transition-colors hover:bg-muted/50"
          aria-label="Open operational profile"
        >
          <Avatar className="size-7 rounded-full">
            {user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
            <AvatarFallback className="bg-primary/15 font-heading text-xs font-bold text-primary">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
