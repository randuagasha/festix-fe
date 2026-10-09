export type EventStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface TicketType {
  id: string;
  name: string;
  price: string | number;
  quota: number;
  availableQuota: number;
}

export interface EventOrganizer {
  id: string;
  email: string;
  fullName: string;
  organizerProfile?: {
    id: string;
    organizationName: string;
    status: string;
  } | null;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  coverImageUrl: string;
  venueImageUrl?: string | null;
  startDatetime: string;
  endDatetime: string;
  isRefundable: boolean;
  status: EventStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  category: EventCategory;
  organizer: EventOrganizer;
  ticketTypes: TicketType[];
}
