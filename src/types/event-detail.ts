export interface EventDetailTicketType {
  id: string;
  eventId: string;
  name: string;
  price: string | number;
  quota: number;
  availableQuota: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventDetailOrganizer {
  id: string;
  fullName: string;
  organizerProfile?: {
    organizationName: string;
  } | null;
}

export interface EventDetailCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicEventDetail {
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
  status: string;
  createdAt: string;
  updatedAt: string;
  category: EventDetailCategory;
  organizer?: EventDetailOrganizer | null;
  ticketTypes: EventDetailTicketType[];
}
