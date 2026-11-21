"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
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
  User as UserIcon,
  House,
  LogOut,
} from "lucide-react";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceProfileMenuItem,
} from "@/components/ui/workspace-sidebar";
import { getMe, type CurrentUser } from "@/lib/auth-api";
import { fetchAdminOrganizers } from "@/components/admin/organizers/organizers-api";

export function AdminSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [pendingOrganizersCount, setPendingOrganizersCount] = useState<number>(0);

  useEffect(() => {
    let active = true;

    async function loadData() {
      // Load current user profile
      const userData = await getMe();
      if (active && userData) {
        setUser(userData);
      }

      // Load pending organizer count for contextual badge
      try {
        const response = await fetchAdminOrganizers({
          status: "PENDING",
          limit: 1,
        });
        if (active && response?.meta?.total) {
          setPendingOrganizersCount(response.meta.total);
        }
      } catch {
        // Silently ignore if offline or unauthorized
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  function handleLogout() {
    Cookies.remove("token");
    toast.success("Logged out successfully");
    router.push("/auth/login");
  }

  const navGroups: WorkspaceNavGroup[] = [
    {
      label: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
          exactMatch: true,
        },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Events", href: "/admin/events", icon: Calendar },
        {
          label: "Organizers",
          href: "/admin/organizers",
          icon: Building2,
          badge: pendingOrganizersCount > 0 ? pendingOrganizersCount : undefined,
          badgeVariant: "amber",
        },
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

  const profileMenuItems: WorkspaceProfileMenuItem[] = [
    {
      label: "My Profile",
      icon: UserIcon,
      onClick: () => router.push("/profile"),
    },
    {
      label: "Go to Home",
      icon: House,
      onClick: () => router.push("/"),
    },
    {
      label: "Log out",
      icon: LogOut,
      destructive: true,
      onClick: handleLogout,
    },
  ];

  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Admin");

  return (
    <WorkspaceSidebar
      workspaceType="admin"
      brand={{
        title: "Tixora",
        subtitle: "Admin Workspace",
        href: "/admin/dashboard",
        logoIcon: Shield,
      }}
      navGroups={navGroups}
      user={{
        name: displayName,
        email: user?.email || "admin@tixora.com",
        subtitle: user?.role || "ADMIN",
        avatar: user?.avatar,
      }}
      profileMenuItems={profileMenuItems}
    />
  );
}
