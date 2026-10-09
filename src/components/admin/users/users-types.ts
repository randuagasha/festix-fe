export type Role = "USER" | "ADMIN" | "STAFF";

export interface UserOrganizerProfile {
  id: string;
  organizationName: string;
  status: string;
  phoneNumber?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  avatar?: string | null;
  role: Role;
  emailVerified: boolean;
  isSuspended: boolean;
  suspendedAt?: string | null;
  suspendReason?: string | null;
  createdAt: string;
  updatedAt: string;
  organizerProfile?: UserOrganizerProfile | null;
  _count?: {
    events: number;
    orders: number;
    assignedEvents: number;
  };
}
