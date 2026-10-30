"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  QrCode,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CurrentUser } from "@/lib/auth-api";

type StaffSidebarProps = {
  user: CurrentUser | null;
  onOpenProfile: () => void;
  onLogout: () => void;
  onOpenScanner: () => void;
};

const navItems = [
  {
    label: "Overview",
    href: "/staff/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Events",
    href: "/staff/events",
    icon: Calendar,
  },
];

export function StaffSidebar({
  user,
  onOpenProfile,
  onLogout,
  onOpenScanner,
}: StaffSidebarProps) {
  const pathname = usePathname();

  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Staff");
  const userInitial = displayName.charAt(0).toUpperCase() || "S";

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="flex h-16 flex-row items-center border-b border-border px-5">
        <Link href="/staff/dashboard" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Ticket className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              Festix<span className="text-primary">.</span>
            </span>
            <span className="flex items-center gap-1 font-sans text-[11px] font-medium text-primary">
              <ShieldCheck className="size-3" /> Staff Workspace
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4">
        {/* Quick Action Button in Sidebar */}
        <div className="mb-3 px-1">
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary font-sans text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <QrCode className="size-4.5" />
            <span>Scan Ticket</span>
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/staff/dashboard" && pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`h-11 rounded-xl px-3.5 font-sans text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/95 hover:text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                      render={<Link href={item.href} />}
                    >
                      <Icon
                        className={`size-4.5 shrink-0 ${
                          isActive ? "text-primary-foreground" : "text-primary"
                        }`}
                      />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <div className="flex items-center justify-between rounded-xl bg-muted/40 p-2">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left transition-opacity hover:opacity-80"
          >
            <Avatar className="size-8 rounded-lg">
              {user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
              <AvatarFallback className="rounded-lg bg-primary/15 font-heading text-xs font-bold text-primary">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-xs font-semibold text-foreground">
                {displayName}
              </p>
              <p className="truncate font-sans text-[10px] text-muted-foreground">
                Operational Staff
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Sign out"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
