import { adminFetch } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/lib/admin-types";
import type {
  OrganizerProfile,
  OrganizerStatus,
  OrganizerDocument,
} from "./organizers-types";

export interface FetchOrganizersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrganizerStatus;
}

export async function fetchAdminOrganizers(
  params: FetchOrganizersParams = {}
): Promise<PaginatedResponse<OrganizerProfile>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  return adminFetch<PaginatedResponse<OrganizerProfile>>(
    `/organizer/admin${query ? `?${query}` : ""}`
  );
}

export async function fetchAdminOrganizerDetail(
  id: string
): Promise<OrganizerProfile> {
  return adminFetch<OrganizerProfile>(`/organizer/admin/${id}`);
}

export async function approveOrganizer(
  id: string
): Promise<{ message: string; organizer: OrganizerProfile }> {
  return adminFetch(`/organizer/admin/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectOrganizer(
  id: string,
  rejectionReason: string
): Promise<{ message: string; organizer: OrganizerProfile }> {
  return adminFetch(`/organizer/admin/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ rejectionReason }),
  });
}

export async function approveDocument(
  docId: string
): Promise<{ message: string; document: OrganizerDocument }> {
  return adminFetch(`/organizer/admin/documents/${docId}/approve`, {
    method: "PATCH",
  });
}

export async function rejectDocument(
  docId: string,
  rejectionReason: string
): Promise<{ message: string; document: OrganizerDocument }> {
  return adminFetch(`/organizer/admin/documents/${docId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ rejectionReason }),
  });
}
