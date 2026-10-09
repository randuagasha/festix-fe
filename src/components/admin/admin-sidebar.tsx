"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Building2,
  Users,
  Receipt,
  Ticket,
  Tag,
  Shield,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Events", href: "/admin/events", icon: Calendar },
      { label: "Organizers", href: "/admin/organizers", icon: Building2 },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Orders", href: "/admin/orders", icon: Receipt },
      { label: "Tickets", href: "/admin/tickets", icon: Ticket },
      { label: "Categories", href: "/admin/categories", icon: Tag },
      { label: "Staff", href: "/admin/staff", icon: Shield },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="flex h-14 flex-row items-center border-b border-border px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow-xs">
            <span className="font-heading text-sm font-bold text-primary-foreground">
              T
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold tracking-tight text-foreground">
              Tixora
            </span>
            <span className="font-sans text-[10px] text-muted-foreground">
              Admin Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-3">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-1">
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(item.href));

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        className={cn(
                          "h-9 gap-3 rounded-lg px-3 font-sans text-xs font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary [&>svg]:text-primary"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        )}
                        render={<Link href={item.href} />}
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
