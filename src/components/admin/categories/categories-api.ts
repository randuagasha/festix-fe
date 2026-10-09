import { adminFetch } from "@/lib/admin-api";
import type { Category, CategoryFormData } from "./categories-types";

export async function fetchCategories(): Promise<Category[]> {
  return adminFetch<Category[]>("/categories");
}

export async function createCategory(
  data: CategoryFormData
): Promise<{ message: string; data: Category }> {
  return adminFetch("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string,
  data: CategoryFormData
): Promise<{ message: string; data: Category }> {
  return adminFetch(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(
  id: string
): Promise<{ message: string }> {
  return adminFetch(`/categories/${id}`, {
    method: "DELETE",
  });
}
