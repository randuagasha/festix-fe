"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "./categories-types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSubmit: (name: string) => Promise<void>;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName("");
    }
  }, [category, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSubmit(name.trim());
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  const isEditing = !!category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <DialogTitle>
              {isEditing ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the category name. The slug will be regenerated automatically."
                : "Add a new category for events. The slug will be generated automatically."}
            </DialogDescription>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <label className="text-xs font-medium text-foreground">
              Category Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Music, Conference, Workshop"
              required
              autoFocus
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
