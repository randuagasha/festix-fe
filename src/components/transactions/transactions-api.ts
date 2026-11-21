import Cookies from "js-cookie";
import { API_URL } from "../../../api";
import type { CustomerTransaction } from "./transactions-types";
import type { IssuedTicketItem } from "@/components/my-tickets/tickets-types";

function getBaseUrl(): string {
  return API_URL || "http://localhost:8000";
}

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchCustomerTransactions(): Promise<CustomerTransaction[]> {
  const res = await fetch(`${getBaseUrl()}/orders`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (res.status === 401) {
    Cookies.remove("token");
    throw new Error("UNAUTHENTICATED");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.status}`);
  }

  return res.json();
}

export async function fetchCustomerTransactionDetail(
  id: string
): Promise<CustomerTransaction> {
  const res = await fetch(`${getBaseUrl()}/orders/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (res.status === 401) {
    Cookies.remove("token");
    throw new Error("UNAUTHENTICATED");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch transaction detail: ${res.status}`);
  }

  return res.json();
}

export async function fetchCustomerIssuedTickets(): Promise<IssuedTicketItem[]> {
  const res = await fetch(`${getBaseUrl()}/issued-tickets/my`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (res.status === 401) {
    Cookies.remove("token");
    throw new Error("UNAUTHENTICATED");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch issued tickets: ${res.status}`);
  }

  return res.json();
}
