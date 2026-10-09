export interface Category {
  id: string;
  name: string;
  slug: string;
  eventCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
}
