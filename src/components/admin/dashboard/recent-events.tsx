import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecentEvent } from "./dashboard-types";
import {
  formatEventStatus,
  getEventStatusVariant,
  formatRelativeDate,
} from "./dashboard-formatters";

export function RecentEvents({ events }: { events: RecentEvent[] }) {
  const safeEvents = events ?? [];

  if (safeEvents.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Latest events created on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">
            No events found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <CardDescription>Latest events created on the platform</CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        {safeEvents.map((event) => (
          <div
            key={event.id}
            className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <p className="truncate font-heading text-sm font-semibold">
                {event.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{event.organizerName ?? "Unknown organizer"}</span>
                {event.categoryName && (
                  <>
                    <span>•</span>
                    <span>{event.categoryName}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Badge variant={getEventStatusVariant(event.status)}>
                {formatEventStatus(event.status)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(event.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
