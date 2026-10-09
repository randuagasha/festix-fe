"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/lib/admin-types";

interface PaginationControlsProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  meta,
  onPageChange,
}: PaginationControlsProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-xs text-muted-foreground">
        Showing page {meta.page} of {meta.totalPages} ({meta.total} total)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous</span>
        </Button>
        <span className="text-xs font-medium">
          {meta.page} / {meta.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  );
}
