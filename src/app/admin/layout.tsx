"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getMe } from "@/lib/auth-api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const user = await getMe();
      if (!active) return;

      if (!user) {
        router.push("/auth/login");
        return;
      }

      if (user.role === "STAFF") {
        toast.error("Staff accounts cannot access administration");
        router.push("/staff/dashboard");
        return;
      }

      if (user.role !== "ADMIN") {
        toast.error("Access denied");
        router.push("/customers/home");
        return;
      }

      setLoading(false);
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="min-w-0 bg-background">
        <AdminTopbar />
        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
