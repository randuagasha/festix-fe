export interface TicketEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  coverImageUrl?: string | null;
  venueImageUrl?: string | null;
  startDatetime: string;
  endDatetime: string;
  isRefundable?: boolean;
  status: string;
}

export interface TicketTypeInfo {
  id: string;
  eventId: string;
  name: string;
  price: string | number;
  quota?: number;
  availableQuota?: number;
  event: TicketEvent;
}

export interface OrderItemWithTicketType {
  id: string;
  orderId: string;
  ticketTypeId: string;
  quantity: number;
  price: string | number;
  createdAt: string;
  ticketType: TicketTypeInfo;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: string | number;
  paymentStatus: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
  paymentMethod?: string | null;
  paymentUrl?: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemWithTicketType[];
}

export interface IssuedTicketItem {
  id: string;
  orderItemId: string;
  ticketCode: string;
  isRedeemed: boolean;
  isCancelled: boolean;
  redeemedAt: string | null;
  createdAt: string;
  orderItem: {
    id: string;
    orderId: string;
    ticketTypeId: string;
    quantity: number;
    price: string | number;
    createdAt: string;
    ticketType: TicketTypeInfo;
    order: {
      id: string;
      orderNumber: string;
      createdAt: string;
    };
  };
}

export type TicketFilterTab = "all" | "pending" | "paid";
