import Cookies from "js-cookie";
import { API_URL } from "../../api";

export class OrganizerApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OrganizerApiError";
    this.status = status;
  }
}

export async function organizerFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = Cookies.get("token");

  if (!token) {
    throw new OrganizerApiError("Authentication required", 401);
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  if (
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type") &&
    options.method &&
    options.method !== "GET"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      if (data && typeof data.message === "string") {
        message = data.message;
      } else if (data && Array.isArray(data.message)) {
        message = data.message.join(", ");
      }
    } catch {
      // response is not json
    }
    throw new OrganizerApiError(message, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export interface OrganizerDashboardData {
  organizationName: string;
  metrics: {
    totalEvents: number;
    publishedEvents: number;
    pendingEvents: number;
    draftEvents: number;
    rejectedEvents: number;
    paidOrdersCount: number;
    totalTicketsSold: number;
    grossRevenue: number;
    checkedInAttendees: number;
  };
  upcomingEvents: {
    id: string;
    title: string;
    coverImageUrl: string;
    location: string;
    startDatetime: string;
    endDatetime: string;
    category: string;
    status: string;
    totalQuota: number;
    soldQuota: number;
  }[];
  actionItems: {
    drafts: {
      id: string;
      title: string;
      ticketTypesCount: number;
      updatedAt: string;
    }[];
    rejected: {
      id: string;
      title: string;
      rejectionReason: string | null;
      updatedAt: string;
    }[];
  };
  recentSales: {
    orderId: string;
    orderNumber: string;
    buyerName: string;
    buyerEmail: string;
    ticketName: string;
    eventTitle: string;
    quantity: number;
    totalAmount: number;
    createdAt: string;
  }[];
}

export interface OrganizerEvent {
  id: string;
  organizerId: string;
  categoryId: string;
  title: string;
  description: string;
  location: string;
  coverImageUrl: string;
  venueImageUrl?: string | null;
  startDatetime: string;
  endDatetime: string;
  isRefundable: boolean;
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  ticketTypes: {
    id: string;
    name: string;
    price: number | string;
    quota: number;
    availableQuota: number;
  }[];
  _count?: {
    staffs: number;
    staffInvitations: number;
  };
  staffs?: {
    id: string;
    userId: string;
    createdAt: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      avatar?: string | null;
    };
  }[];
  staffInvitations?: {
    id: string;
    userId: string;
    activated: boolean;
    createdAt: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      avatar?: string | null;
    };
  }[];
}

export interface OrganizerStaffItem {
  id: string;
  type: "ACTIVE" | "PENDING";
  assignmentId?: string;
  invitationId?: string;
  eventId: string;
  eventTitle: string;
  eventStatus: string;
  startDatetime: string;
  userId: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
}

export interface OrganizerCheckinData {
  eventId: string;
  eventTitle: string;
  eventStatus: string;
  startDatetime: string;
  endDatetime: string;
  statistics: {
    totalParticipants: number;
    totalRedeemed: number;
    remainingTickets: number;
    redemptionRate: number;
  };
  recentRedemptions: {
    id: string;
    ticketCode: string;
    ticketType: string;
    buyerName: string;
    redeemedAt: string;
  }[];
}
