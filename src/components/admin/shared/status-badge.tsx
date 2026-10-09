import { Badge } from "@/components/ui/badge";

const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  // Event statuses
  PUBLISHED: "default",
  PENDING_REVIEW: "secondary",
  DRAFT: "outline",
  REJECTED: "destructive",
  CANCELLED: "destructive",
  COMPLETED: "outline",

  // Organizer statuses
  APPROVED: "default",
  PENDING: "secondary",

  // Order statuses
  PAID: "default",
  EXPIRED: "outline",
  FAILED: "destructive",

  // Roles
  ADMIN: "default",
  STAFF: "secondary",
  USER: "outline",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = variantMap[status] || "outline";
  const displayLabel = status.replace(/_/g, " ");

  return (
    <Badge variant={variant} className={className}>
      {displayLabel}
    </Badge>
  );
}
