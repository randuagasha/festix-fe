import { Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecentEvent } from "./dashboard-types";
import {
  formatEventStatus,
  getEventStatusVariant,
  formatRelativeDate,
} from "./dashboard-formatters";

export function RecentEvents({ events }: { events: RecentEvent[] }) {
  const safeEvents = events ?? [];

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:shadow-sm">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Calendar className="size-3.5" />
            </div>
            <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
              Recent Events
            </h3>
          </div>
          <span className="font-sans text-xs text-muted-foreground">
            {safeEvents.length} latest
          </span>
        </div>

        {safeEvents.length === 0 ? (
          <p className="py-8 text-center font-sans text-xs text-muted-foreground">
            No events created yet.
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {safeEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-xs font-semibold text-foreground">
                    {event.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 font-sans text-[11px] text-muted-foreground">
                    <span className="truncate">{event.organizerName ?? "Individual"}</span>
                    {event.categoryName && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Tag className="size-2.5" />
                          {event.categoryName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={getEventStatusVariant(event.status)} className="px-1.5 py-0 text-[10px]">
                    {formatEventStatus(event.status)}
                  </Badge>
                  <span className="font-sans text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatRelativeDate(event.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
