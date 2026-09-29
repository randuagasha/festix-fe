"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { DashboardSummaryCards } from "@/components/admin/dashboard/dashboard-summary";
import { RevenueOrdersSection } from "@/components/admin/dashboard/revenue-orders-section";
import { EventAnalyticsSection } from "@/components/admin/dashboard/event-analytics-section";
import { TicketSnapshot } from "@/components/admin/dashboard/ticket-snapshot";
import { RecentEvents } from "@/components/admin/dashboard/recent-events";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { DashboardSkeleton } from "@/components/admin/dashboard/dashboard-skeleton";
import { DashboardErrorView } from "@/components/admin/dashboard/dashboard-error";
import {
  fetchAdminDashboard,
  DashboardApiError,
} from "@/components/admin/dashboard/dashboard-api";
import type { DashboardData } from "@/components/admin/dashboard/dashboard-types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status?: number; message?: string } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const result = await fetchAdminDashboard();
        if (!ignore) {
          setData(result);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (err instanceof DashboardApiError) {
            if (err.status === 401) {
              Cookies.remove("token");
              toast.error("Session expired. Please log in again.");
              router.push("/auth/login");
              return;
            }
            setError({ status: err.status, message: err.message });
          } else {
            setError({
              status: 500,
              message:
                err instanceof Error ? err.message : "Failed to load dashboard data",
            });
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [router, reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <DashboardErrorView
        status={error.status}
        message={error.message}
        onRetry={handleRetry}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-4">
      <DashboardHeader />

      <DashboardSummaryCards
        summary={data.summary}
        totalRevenue={data.orders.totalRevenue}
      />

      <RevenueOrdersSection
        monthly={data.orders.monthly}
        totalRevenue={data.orders.totalRevenue}
        paidOrders={data.summary.paidOrders}
      />

      <TicketSnapshot
        tickets={data.tickets}
        paymentStatus={data.orders.byStatus}
      />

      <EventAnalyticsSection
        byStatus={data.events.byStatus}
        byCategory={data.events.byCategory}
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <RecentEvents events={data.recent.events} />
        <RecentOrders orders={data.recent.orders} />
      </div>
    </div>
  );
}
