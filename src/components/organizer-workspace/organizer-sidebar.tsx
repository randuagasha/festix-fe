"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  Ticket,
  ChevronLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    label: "Dashboard",
    href: "/organizer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Events",
    href: "/organizer/events",
    icon: Calendar,
  },
  {
    label: "Create Event",
    href: "/organizer/events/create",
    icon: CalendarPlus,
  },
  {
    label: "Staff & Invitations",
    href: "/organizer/staff",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/organizer/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/organizer/settings",
    icon: Settings,
  },
];

export function OrganizerSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="flex h-16 flex-row items-center border-b border-border px-5">
        <Link href="/organizer/dashboard" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Ticket className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              Festix<span className="text-primary">.</span>
            </span>
            <span className="flex items-center gap-1 font-sans text-[11px] font-medium text-primary">
              <Sparkles className="size-3" /> Organizer Hub
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/organizer/dashboard" &&
                    item.href !== "/organizer/events" &&
                    pathname.startsWith(item.href)) ||
                  (item.href === "/organizer/events" &&
                    pathname.startsWith("/organizer/events") &&
                    pathname !== "/organizer/events/create");

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
                      <Icon className={`size-4.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
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
        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        >
          <ChevronLeft className="size-4 shrink-0" />
          <span>Back to Profile</span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
