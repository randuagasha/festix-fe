export interface BackendTicketType {
  id: string;
  eventId: string;
  name: string;
  price: string;
  quota: number;
  availableQuota: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendCategory {
  name: string;
}

export interface BackendEvent {
  id: string;
  organizerId: string;
  categoryId: string;
  title: string;
  description: string;
  location: string;
  coverImageUrl: string;
  coverImageId: string;
  venueImageUrl: string | null;
  venueImageId: string | null;
  startDatetime: string;
  endDatetime: string;
  isRefundable: boolean;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  category: BackendCategory;
  ticketTypes: BackendTicketType[];
}

export type Event = {
  id: string;
  title: string;
  artist: string;
  category: string;
  location: string;
  date: string;
  day: string;
  month: string;
  price: number;
  image: string;
  available: number;
  startDatetime: string;
  endDatetime: string;
  status: string;
};

export function mapBackendEvent(raw: BackendEvent): Event {
  const dt = new Date(raw.startDatetime);
  const validDate = !isNaN(dt.getTime());

  const prices = raw.ticketTypes.map((t) => Number(t.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const totalAvailable = raw.ticketTypes.reduce(
    (sum, t) => sum + t.availableQuota,
    0,
  );

  return {
    id: raw.id,
    title: raw.title,
    artist: "",
    category: raw.category?.name || "General",
    location: raw.location,
    date: validDate
      ? dt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    day: validDate
      ? String(dt.getDate()).padStart(2, "0")
      : "--",
    month: validDate
      ? dt
          .toLocaleDateString("en-US", { month: "short" })
          .toUpperCase()
      : "---",
    price: minPrice,
    image: raw.coverImageUrl || "/images/hero.jpg",
    available: totalAvailable,
    startDatetime: raw.startDatetime,
    endDatetime: raw.endDatetime,
    status: raw.status,
  };
}
