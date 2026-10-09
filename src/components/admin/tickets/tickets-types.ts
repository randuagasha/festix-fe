export interface AdminTicketEvent {
  id: string;
  title: string;
  location?: string;
  startDatetime?: string;
  endDatetime?: string;
}

export interface AdminTicketType {
  id: string;
  name: string;
  price?: string | number;
  event: AdminTicketEvent;
}

export interface AdminTicketOrder {
  id: string;
  orderNumber: string;
  paymentStatus: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface AdminTicket {
  id: string;
  ticketCode: string;
  isRedeemed: boolean;
  isCancelled: boolean;
  redeemedAt?: string | null;
  createdAt: string;
  orderItem: {
    id: string;
    quantity: number;
    price: string | number;
    ticketType: AdminTicketType;
    order: AdminTicketOrder;
  };
}
