import { adminFetch } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/lib/admin-types";
import type { AuditLog } from "./audit-types";

export interface FetchAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entityType?: string;
  actorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchAdminAuditLogs(
  params: FetchAuditLogsParams = {}
): Promise<PaginatedResponse<AuditLog>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.action) searchParams.set("action", params.action);
  if (params.entityType) searchParams.set("entityType", params.entityType);
  if (params.actorId) searchParams.set("actorId", params.actorId);
  if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) searchParams.set("dateTo", params.dateTo);

  const query = searchParams.toString();
  return adminFetch<PaginatedResponse<AuditLog>>(
    `/audit-logs/admin${query ? `?${query}` : ""}`
  );
}

export async function fetchAdminAuditLogDetail(id: string): Promise<AuditLog> {
  return adminFetch<AuditLog>(`/audit-logs/admin/${id}`);
}
