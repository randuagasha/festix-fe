import { adminFetch } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/lib/admin-types";
import type { AdminOrder, PaymentStatus } from "./orders-types";

export interface FetchOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchAdminOrders(
  params: FetchOrdersParams = {}
): Promise<PaginatedResponse<AdminOrder>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) searchParams.set("dateTo", params.dateTo);

  const query = searchParams.toString();
  return adminFetch<PaginatedResponse<AdminOrder>>(
    `/orders/admin${query ? `?${query}` : ""}`
  );
}

export async function fetchAdminOrderDetail(id: string): Promise<AdminOrder> {
  return adminFetch<AdminOrder>(`/orders/admin/${id}`);
}
