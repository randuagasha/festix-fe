import { adminFetch } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/lib/admin-types";
import type { AdminTicket } from "./tickets-types";

export interface FetchTicketsParams {
  page?: number;
  limit?: number;
  search?: string;
  eventId?: string;
  isRedeemed?: boolean;
  isCancelled?: boolean;
}

export async function fetchAdminTickets(
  params: FetchTicketsParams = {}
): Promise<PaginatedResponse<AdminTicket>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.eventId) searchParams.set("eventId", params.eventId);
  if (params.isRedeemed !== undefined)
    searchParams.set("isRedeemed", params.isRedeemed.toString());
  if (params.isCancelled !== undefined)
    searchParams.set("isCancelled", params.isCancelled.toString());

  const query = searchParams.toString();
  return adminFetch<PaginatedResponse<AdminTicket>>(
    `/issued-tickets/admin${query ? `?${query}` : ""}`
  );
}

export async function fetchAdminTicketDetail(
  id: string
): Promise<AdminTicket> {
  return adminFetch<AdminTicket>(`/issued-tickets/admin/${id}`);
}
