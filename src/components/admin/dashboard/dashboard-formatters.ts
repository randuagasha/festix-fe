const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("id-ID");

export function formatIDR(value: number): string {
  return idrFormatter.format(value);
}

export function formatCompactIDR(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp${compactFormatter.format(value)}`;
  }
  if (value >= 1_000_000) {
    return `Rp${compactFormatter.format(value)}`;
  }
  return idrFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatMonth(yyyyMm: string): string {
  const [year, month] = yyyyMm.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

export function formatShortMonth(yyyyMm: string): string {
  const [year, month] = yyyyMm.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("id-ID", { month: "short" });
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const eventStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  EXPIRED: "Expired",
  FAILED: "Failed",
};

export function formatEventStatus(status: string): string {
  return eventStatusLabels[status] ?? status;
}

export function formatPaymentStatus(status: string): string {
  return paymentStatusLabels[status] ?? status;
}

export function getEventStatusVariant(
  status: string
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "PUBLISHED":
      return "default";
    case "COMPLETED":
      return "secondary";
    case "PENDING_REVIEW":
    case "DRAFT":
      return "outline";
    case "REJECTED":
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

export function getPaymentStatusVariant(
  status: string
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "PAID":
      return "default";
    case "PENDING":
      return "outline";
    case "EXPIRED":
      return "secondary";
    case "FAILED":
      return "destructive";
    default:
      return "outline";
  }
}
