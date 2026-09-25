import Cookies from "js-cookie";
import { API_URL } from "../../../../api";
import type { DashboardData } from "./dashboard-types";

export class DashboardApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DashboardApiError";
    this.status = status;
  }
}

export async function fetchAdminDashboard(): Promise<DashboardData> {
  const token = Cookies.get("token");

  if (!token) {
    throw new DashboardApiError("Authentication required", 401);
  }

  const response = await fetch(`${API_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Failed to load dashboard data";
    try {
      const data = await response.json();
      if (data && typeof data.message === "string") {
        message = data.message;
      }
    } catch {
      // response is not json
    }
    throw new DashboardApiError(message, response.status);
  }

  return response.json();
}
