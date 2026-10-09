"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/admin/shared/page-header";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { SearchInput } from "@/components/admin/shared/search-input";
import { CategoryDialog } from "@/components/admin/categories/category-dialog";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/components/admin/categories/categories-api";
import { AdminApiError } from "@/lib/admin-api";
import type { Category } from "@/components/admin/categories/categories-types";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) {
        Cookies.remove("token");
        router.push("/auth/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreateOrEdit(name: string) {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name });
        toast.success("Category updated successfully");
      } else {
        await createCategory({ name });
        toast.success("Category created successfully");
      }
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
      throw err;
    }
  }

  async function handleDelete() {
    if (!deletingCategory) return;

    setActionLoading(true);
    try {
      await deleteCategory(deletingCategory.id);
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingCategory(null);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Category Management"
        description="Organize events with categories. Create, edit, and manage category listings."
      >
        <Button
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="size-4" />
          <span>Add Category</span>
        </Button>
      </PageHeader>

      <div className="mb-4 flex items-center justify-between gap-4">
        <SearchInput
          placeholder="Filter categories..."
          value={search}
          onChange={setSearch}
        />
        <span className="text-xs text-muted-foreground">
          {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertCircle className="size-8 text-destructive mb-2" />
          <p className="font-heading text-sm font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={loadData} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Tag className="size-8 text-muted-foreground mb-2" />
          <p className="font-heading text-sm font-semibold">No categories found</p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {search ? "No categories match your search." : "Get started by creating your first category."}
          </p>
          {!search && (
            <Button
              size="sm"
              onClick={() => {
                setEditingCategory(null);
                setDialogOpen(true);
              }}
              className="mt-4 gap-2"
            >
              <Plus className="size-4" />
              <span>Add Category</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Associated Events</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {cat.slug}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {cat.eventCount ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(cat);
                          setDialogOpen(true);
                        }}
                        className="size-8 p-0"
                      >
                        <Pencil className="size-3.5 text-muted-foreground" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingCategory(cat);
                          setDeleteDialogOpen(true);
                        }}
                        className="size-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSubmit={handleCreateOrEdit}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}
