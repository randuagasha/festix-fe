import { adminFetch } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/lib/admin-types";
import type { AdminUser, Role } from "./users-types";

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  isSuspended?: boolean;
}

export async function fetchAdminUsers(
  params: FetchUsersParams = {}
): Promise<PaginatedResponse<AdminUser>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);
  if (params.isSuspended !== undefined)
    searchParams.set("isSuspended", params.isSuspended.toString());

  const query = searchParams.toString();
  return adminFetch<PaginatedResponse<AdminUser>>(
    `/users/admin${query ? `?${query}` : ""}`
  );
}

export async function fetchAdminUserDetail(id: string): Promise<AdminUser> {
  return adminFetch<AdminUser>(`/users/admin/${id}`);
}

export async function changeUserRole(
  id: string,
  role: Role
): Promise<{ message: string; user: AdminUser }> {
  return adminFetch(`/users/admin/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function suspendUser(
  id: string,
  reason: string
): Promise<{ message: string; user: AdminUser }> {
  return adminFetch(`/users/admin/${id}/suspend`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}

export async function unsuspendUser(
  id: string
): Promise<{ message: string; user: AdminUser }> {
  return adminFetch(`/users/admin/${id}/unsuspend`, {
    method: "PATCH",
  });
}
