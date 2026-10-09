export type PaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "FAILED";

export interface OrderItemTicketType {
  id: string;
  name: string;
  price: string | number;
  event: {
    id: string;
    title: string;
    location?: string;
    startDatetime?: string;
    endDatetime?: string;
  };
}

export interface OrderIssuedTicket {
  id: string;
  ticketCode: string;
  isRedeemed: boolean;
  isCancelled: boolean;
  redeemedAt?: string | null;
  createdAt: string;
}

export interface AdminOrderItem {
  id: string;
  orderId: string;
  ticketTypeId: string;
  quantity: number;
  price: string | number;
  ticketType: OrderItemTicketType;
  issuedTickets?: OrderIssuedTicket[];
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: string | number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  paymentUrl?: string | null;
  pgTransactionId?: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  orderItems: AdminOrderItem[];
}
