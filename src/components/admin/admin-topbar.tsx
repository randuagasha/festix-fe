"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
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

export function AdminTopbar() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      const userData = await getMe();
      if (!ignore && userData) {
        setUser(userData);
      }
    }

    loadUser();

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
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Admin");
  const displayRole = user?.role || "ADMIN";
  const userInitial = displayName.charAt(0).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <Separator orientation="vertical" className="h-4 md:hidden" />
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-sm font-semibold tracking-tight md:text-base">
            Dashboard
          </h1>
          <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 font-sans text-[11px] font-medium text-primary sm:inline-block">
            Admin
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2.5 rounded-full border border-border/70 bg-card py-1 pr-2.5 pl-1.5 shadow-xs transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <Avatar size="sm" className="size-7 rounded-full bg-primary/15 text-primary">
              {user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
              <AvatarFallback className="bg-primary/15 font-heading text-xs font-bold text-primary">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start text-left sm:flex">
              <span className="max-w-[120px] truncate font-sans text-xs font-semibold leading-tight text-foreground">
                {displayName}
              </span>
              <span className="font-sans text-[10px] leading-tight text-muted-foreground">
                {displayRole}
              </span>
            </div>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-lg">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5">
                <p className="font-sans text-xs font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="truncate font-sans text-[11px] text-muted-foreground">
                  {user?.email || "admin@festix.com"}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer gap-2 px-2 py-1.5 font-sans text-xs"
            >
              <UserIcon className="size-3.5 text-muted-foreground" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              className="cursor-pointer gap-2 px-2 py-1.5 font-sans text-xs"
            >
              <LogOut className="size-3.5 text-destructive" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
