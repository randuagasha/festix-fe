export type OrganizerStatus = "PENDING" | "APPROVED" | "REJECTED";
export type OrganizerDocumentStatus = "PENDING" | "APPROVED" | "REJECTED";
export type OrganizerDocumentType =
  | "BUSINESS_LICENSE"
  | "GUARANTEE_LETTER"
  | "ORGANIZATION_REGISTRATION"
  | "IDENTITY_CARD";

export interface OrganizerDocument {
  id: string;
  organizerId: string;
  type: OrganizerDocumentType;
  status: OrganizerDocumentStatus;
  fileUrl: string;
  publicId: string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerUser {
  id: string;
  email: string;
  fullName: string;
  createdAt?: string;
  emailVerified?: boolean;
  role?: string;
}

export interface OrganizerProfile {
  id: string;
  userId: string;
  organizationName: string;
  phoneNumber: string;
  address: string;
  identityCardNumber?: string | null;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  status: OrganizerStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  user: OrganizerUser;
  documents: OrganizerDocument[];
}
