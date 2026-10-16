"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronDown,
  LogOut,
  User as UserIcon,
  Building2,
  CalendarPlus,
  ShieldCheck,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMe, type CurrentUser } from "@/lib/auth-api";
import { organizerFetch } from "@/lib/organizer-api";

const pageTitles: Record<string, string> = {
  "/organizer/dashboard": "Dashboard",
  "/organizer/events": "My Events",
  "/organizer/events/create": "Create Event",
  "/organizer/staff": "Staff & Team Roster",
  "/organizer/analytics": "Performance & Analytics",
  "/organizer/settings": "Organization Settings",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];

  if (pathname.startsWith("/organizer/events/") && pathname !== "/organizer/events/create") {
    return "Event Workspace";
  }

  for (const [route, title] of Object.entries(pageTitles)) {
    if (route !== "/organizer/dashboard" && pathname.startsWith(route)) {
      return title;
    }
  }

  return "Organizer Hub";
}

export function OrganizerTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [orgName, setOrgName] = useState<string>("");

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const userData = await getMe();
      if (!ignore && userData) {
        setUser(userData);
      }

      try {
        const org = await organizerFetch<any>("/organizer/me");
        if (!ignore && org?.organizationName) {
          setOrgName(org.organizationName);
        }
      } catch {
        // ignore
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  function handleLogout() {
    Cookies.remove("token");
    toast.success("Logged out successfully");
    router.push("/auth/login");
  }

  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Organizer");
  const userInitial = displayName.charAt(0).toUpperCase() || "O";
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {pageTitle}
          </h1>
          {orgName && (
            <span className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-primary md:inline-flex">
              <ShieldCheck className="size-3.5" />
              {orgName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/organizer/events/create"
          className="hidden items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 font-sans text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/95 sm:inline-flex"
        >
          <CalendarPlus className="size-3.5" />
          <span>New Event</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-xl p-1.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8.5 rounded-lg border">
              <AvatarImage src={user?.avatar ?? undefined} alt={displayName} />
              <AvatarFallback className="rounded-lg bg-primary/10 font-sans text-xs font-semibold text-primary">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start sm:flex">
              <span className="max-w-[130px] truncate font-sans text-xs font-semibold text-foreground">
                {displayName}
              </span>
              <span className="font-sans text-[10px] text-muted-foreground">
                {orgName || "Organizer"}
              </span>
            </div>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 font-sans">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer gap-2 px-2 py-1.5 font-sans text-xs"
              >
                <UserIcon className="size-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/organizer/settings")}
                className="cursor-pointer gap-2 px-2 py-1.5 font-sans text-xs"
              >
                <Building2 className="size-4" />
                <span>Organization Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
