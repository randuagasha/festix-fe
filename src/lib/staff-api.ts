import Cookies from "js-cookie";
import { API_URL } from "../../api";

export class StaffApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public raw?: unknown,
  ) {
    super(message);
    this.name = "StaffApiError";
  }
}

export type StaffAssignedEvent = {
  id: string;
  title: string;
  coverImageUrl: string | null;
  status: string;
  location: string;
  startDatetime: string;
  endDatetime: string;
  isActive: boolean;
  assignedAt: string;
  participantSummary: {
    totalParticipants: number;
    totalRedeemed: number;
  };
};

export type StaffEventDashboard = {
  event: {
    id: string;
    title: string;
    status: string;
    location: string;
    startDatetime: string;
    endDatetime: string;
    isActive: boolean;
  };
  statistics: {
    totalParticipants: number;
    totalRedeemed: number;
    remainingTickets: number;
    redemptionRate: number;
  };
  recentRedemptions: Array<{
    id: string;
    ticketCode: string;
    ticketType: string;
    buyerName: string;
    redeemedAt: string;
  }>;
};

export type TicketLookupResult = {
  id: string;
  ticketCode: string;
  isRedeemed: boolean;
  isCancelled: boolean;
  redeemedAt: string | null;
  createdAt: string;
  ticketType: {
    id: string;
    name: string;
    price: string | number;
  };
  event: {
    id: string;
    title: string;
    status: string;
    location: string;
    startDatetime: string;
    endDatetime: string;
  };
  order: {
    orderNumber: string;
    paymentStatus: string;
  };
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
};

export type TicketRedemptionResult = {
  message: string;
  ticket: TicketLookupResult;
};

export async function staffFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = Cookies.get("token");

  if (!token) {
    throw new StaffApiError("Authentication token not found", 401);
  }

  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      Cookies.remove("token");
    }
    const message =
      (Array.isArray(json?.message) ? json?.message[0] : json?.message) ||
      `Request failed with status ${res.status}`;
    throw new StaffApiError(message, res.status, json);
  }

  return json as T;
}
