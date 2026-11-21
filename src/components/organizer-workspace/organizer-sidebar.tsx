"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  Users,
  BarChart3,
  Settings,
  Ticket,
  Sparkles,
  User as UserIcon,
  Building2,
  House,
  LogOut,
} from "lucide-react";
import {
  WorkspaceSidebar,
  type WorkspaceNavGroup,
  type WorkspaceProfileMenuItem,
} from "@/components/ui/workspace-sidebar";
import { getMe, type CurrentUser } from "@/lib/auth-api";
import { organizerFetch } from "@/lib/organizer-api";

export function OrganizerSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [orgName, setOrgName] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      // Load current user profile
      const userData = await getMe();
      if (active && userData) {
        setUser(userData);
      }

      // Load organization profile details
      try {
        const org = await organizerFetch<{ organizationName?: string }>("/organizer/me");
        if (active && org?.organizationName) {
          setOrgName(org.organizationName);
        }
      } catch {
        // Silently ignore if unauthorized or error
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
      label: "Workspace",
      items: [
        {
          label: "Dashboard",
          href: "/organizer/dashboard",
          icon: LayoutDashboard,
          exactMatch: true,
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
          exactMatch: true,
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
      label: "Organization Profile",
      icon: Building2,
      onClick: () => router.push("/organizer/settings"),
    },
    {
      label: "Back to Home",
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
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Organizer");

  return (
    <WorkspaceSidebar
      workspaceType="organizer"
      brand={{
        title: "Tixora",
        subtitle: "Organizer Hub",
        subtitleIcon: Sparkles,
        href: "/organizer/dashboard",
        logoIcon: Ticket,
      }}
      navGroups={navGroups}
      user={{
        name: displayName,
        email: user?.email || "organizer@tixora.com",
        subtitle: orgName || "Organizer",
        avatar: user?.avatar,
      }}
      profileMenuItems={profileMenuItems}
    />
  );
}
