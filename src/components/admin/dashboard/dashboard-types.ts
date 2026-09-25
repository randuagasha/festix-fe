export type DashboardSummary = {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  publishedEvents: number;
  pendingEvents: number;
  totalTicketTypes: number;
  totalOrders: number;
  paidOrders: number;
  totalIssuedTickets: number;
  totalRedeemedTickets: number;
};

export type EventStatusEntry = {
  status: string;
  count: number;
};

export type EventCategoryEntry = {
  category: string;
  count: number;
};

export type OrderStatusEntry = {
  status: string;
  count: number;
};

export type MonthlyOrderEntry = {
  month: string;
  orders: number;
  revenue: number;
};

export type TicketStats = {
  total: number;
  redeemed: number;
  unredeemed: number;
  cancelled: number;
};

export type RecentEvent = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  organizerName: string | null;
  categoryName: string | null;
};

export type RecentOrder = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  purchaserName: string | null;
  purchaserEmail: string | null;
};

export type DashboardData = {
  summary: DashboardSummary;
  events: {
    byStatus: EventStatusEntry[];
    byCategory: EventCategoryEntry[];
  };
  orders: {
    byStatus: OrderStatusEntry[];
    totalRevenue: number;
    monthly: MonthlyOrderEntry[];
  };
  tickets: TicketStats;
  recent: {
    events: RecentEvent[];
    orders: RecentOrder[];
  };
};
