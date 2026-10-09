import { adminFetch } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/lib/admin-types";
import type { AdminEvent, EventStatus } from "./events-types";

export interface FetchEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EventStatus;
  categoryId?: string;
}

export async function fetchAdminEvents(
  params: FetchEventsParams = {}
): Promise<PaginatedResponse<AdminEvent>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);

  const query = searchParams.toString();
  return adminFetch<PaginatedResponse<AdminEvent>>(
    `/events/admin${query ? `?${query}` : ""}`
  );
}

export async function fetchAdminEventDetail(
  id: string
): Promise<AdminEvent> {
  return adminFetch<AdminEvent>(`/events/admin/${id}`);
}

export async function approveEvent(
  id: string
): Promise<{ message: string; event: AdminEvent }> {
  return adminFetch(`/events/admin/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectEvent(
  id: string,
  reason: string
): Promise<{ message: string; event: AdminEvent }> {
  return adminFetch(`/events/admin/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}

export async function cancelEvent(
  id: string,
  reason: string
): Promise<{ message: string; event: AdminEvent }> {
  return adminFetch(`/events/admin/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}
