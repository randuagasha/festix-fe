import type { CustomerOrder } from "@/components/my-tickets/tickets-types";

export type TransactionPaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "FAILED";

export type TransactionFilterTab = "all" | "pending" | "paid" | "expired";

export type CustomerTransaction = CustomerOrder;
