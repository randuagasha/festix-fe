"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ScrollText, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SearchInput } from "@/components/admin/shared/search-input";
import { PaginationControls } from "@/components/admin/shared/pagination-controls";
import { fetchAdminAuditLogs } from "@/components/admin/audit-logs/audit-api";
import { AdminApiError } from "@/lib/admin-api";
import type { AuditLog } from "@/components/admin/audit-logs/audit-types";
import type { PaginationMeta } from "@/lib/admin-types";

const actionBadgeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  APPROVE: "default",
  REJECT: "destructive",
  CANCEL: "destructive",
  SUSPEND: "destructive",
  UNSUSPEND: "default",
  CHANGE_ROLE: "secondary",
  ASSIGN_STAFF: "default",
  REMOVE_STAFF: "destructive",
  APPROVE_DOCUMENT: "default",
  REJECT_DOCUMENT: "destructive",
};

export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail dialog
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadData = useCallback(
    async (page = 1) => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetchAdminAuditLogs({
          page,
          limit: 10,
          search: search || undefined,
        });
        setLogs(response.data);
        setMeta(response.meta);
      } catch (err) {
        if (err instanceof AdminApiError && err.status === 401) {
          Cookies.remove("token");
          router.push("/auth/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    },
    [router, search]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Immutable record of administrative actions, role modifications, event reviews, and security mutations."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search action, entity type, ID..."
          value={search}
          onChange={(val) => setSearch(val)}
        />
        <span className="text-xs text-muted-foreground">
          {meta.total} {meta.total === 1 ? "audit entry" : "audit entries"}
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
          <Button variant="outline" size="sm" onClick={() => loadData(meta.page)} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <ScrollText className="size-8 text-muted-foreground mb-2" />
          <p className="font-heading text-sm font-semibold">No audit entries found</p>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {search
              ? "No entries match your search query."
              : "Administrative actions will be recorded here as they occur."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Actor ID</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const variant = actionBadgeColors[log.action] || "outline";

                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={variant} className="text-[10px]">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {log.entityType}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">
                      {log.entityId || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">
                      {log.actorId || "System"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedLog(log);
                          setDetailOpen(true);
                        }}
                        className="size-8 p-0"
                      >
                        <Eye className="size-4 text-muted-foreground" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <PaginationControls
            meta={meta}
            onPageChange={(page) => loadData(page)}
          />
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogPopup>
          <div className="flex flex-col gap-2">
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Inspection of recorded administrative mutation.
            </DialogDescription>
          </div>

          {selectedLog && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3">
                <div>
                  <span className="text-muted-foreground">Action:</span>
                  <p className="font-semibold">{selectedLog.action}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Entity:</span>
                  <p className="font-semibold">{selectedLog.entityType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Entity ID:</span>
                  <p className="font-mono text-[11px] truncate">
                    {selectedLog.entityId || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Actor ID:</span>
                  <p className="font-mono text-[11px] truncate">
                    {selectedLog.actorId || "System"}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <p>{new Date(selectedLog.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground font-medium">Metadata (JSON):</span>
                <pre className="mt-1.5 max-h-48 overflow-auto rounded-lg bg-muted p-3 font-mono text-[11px] text-foreground">
                  {selectedLog.metadata
                    ? JSON.stringify(selectedLog.metadata, null, 2)
                    : "No additional metadata recorded"}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Close
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </div>
  );
}
