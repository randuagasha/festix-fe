export interface StaffAssignedEvent {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    location: string;
    startDatetime: string;
    endDatetime: string;
    status: string;
  };
}

export interface AdminStaffUser {
  id: string;
  email: string;
  fullName: string;
  avatar?: string | null;
  role: string;
  emailVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  _count?: {
    assignedEvents: number;
  };
  assignedEvents?: StaffAssignedEvent[];
}
