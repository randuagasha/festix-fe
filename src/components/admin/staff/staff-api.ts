import { adminFetch } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/lib/admin-types";
import type { AdminStaffUser, StaffAssignedEvent } from "./staff-types";

export interface FetchStaffParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchAdminStaff(
  params: FetchStaffParams = {}
): Promise<PaginatedResponse<AdminStaffUser>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return adminFetch<PaginatedResponse<AdminStaffUser>>(
    `/staff/admin${query ? `?${query}` : ""}`
  );
}

export async function fetchAdminStaffDetail(
  id: string
): Promise<AdminStaffUser> {
  return adminFetch<AdminStaffUser>(`/staff/admin/${id}`);
}

export async function assignStaffToEvent(
  userId: string,
  eventId: string
): Promise<{ message: string; assignment: StaffAssignedEvent }> {
  return adminFetch("/staff/admin/assign", {
    method: "POST",
    body: JSON.stringify({ userId, eventId }),
  });
}

export async function removeStaffAssignment(
  assignmentId: string
): Promise<{ message: string }> {
  return adminFetch(`/staff/admin/assign/${assignmentId}`, {
    method: "DELETE",
  });
}
