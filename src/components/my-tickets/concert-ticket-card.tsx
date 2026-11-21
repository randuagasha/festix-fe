"use client";

import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  QrCode,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IssuedTicketItem } from "./tickets-types";

interface ConcertTicketCardProps {
  ticket: IssuedTicketItem;
  onSelect: (ticket: IssuedTicketItem) => void;
}

function formatSchedule(dateString: string) {
  try {
    const d = new Date(dateString);
    const dayName = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(d);
    const fullDate = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
    const timeString =
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d) + " WIB";
    return { dayName, fullDate, timeString };
  } catch {
    return { dayName: "", fullDate: dateString, timeString: "" };
  }
}

export function ConcertTicketCard({ ticket, onSelect }: ConcertTicketCardProps) {
  const event = ticket.orderItem.ticketType.event;
  const ticketType = ticket.orderItem.ticketType;
  const order = ticket.orderItem.order;

  const schedule = formatSchedule(event.startDatetime);

  // Determine ticket status
  const isPast = new Date(event.endDatetime || event.startDatetime).getTime() < Date.now();
  let statusBadge: {
    label: string;
    variant: "active" | "redeemed" | "cancelled" | "past";
    icon: typeof CheckCircle2;
  };

  if (ticket.isCancelled) {
    statusBadge = {
      label: "Dibatalkan",
      variant: "cancelled",
      icon: XCircle,
    };
  } else if (ticket.isRedeemed) {
    statusBadge = {
      label: "Sudah Check-In",
      variant: "redeemed",
      icon: CheckCircle2,
    };
  } else if (isPast) {
    statusBadge = {
      label: "Acara Selesai",
      variant: "past",
      icon: Clock3,
    };
  } else {
    statusBadge = {
      label: "Siap Digunakan",
      variant: "active",
      icon: CheckCircle2,
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div
      onClick={() => onSelect(ticket)}
      className="group relative flex flex-col md:flex-row rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md cursor-pointer overflow-hidden"
    >
      {/* LEFT SECTION: Event Focus */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 flex-1 min-w-0">
        {/* Event Cover Image */}
        {event.coverImageUrl ? (
          <div className="relative h-40 sm:h-32 sm:w-44 rounded-xl overflow-hidden shrink-0 border border-border/50 bg-muted">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-40 sm:h-32 sm:w-44 rounded-xl bg-primary/10 items-center justify-center shrink-0 border border-primary/20">
            <Ticket className="size-10 text-primary" />
          </div>
        )}

        {/* Event Meta Details */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            {/* Category / Tier Tag */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Sparkles className="size-3" />
                {ticketType.name}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground/80">
                Order #{order.orderNumber}
              </span>
            </div>

            {/* Event Name */}
            <h3 className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
          </div>

          {/* Schedule & Location */}
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-primary shrink-0" />
              <span>
                {schedule.dayName ? `${schedule.dayName}, ` : ""}
                {schedule.fullDate}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <Clock className="size-3.5 text-primary shrink-0" />
              <span>{schedule.timeString}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PERFORATION NOTCHES & LINE */}
      {/* Desktop Perforation (Vertical) */}
      <div className="relative hidden md:flex flex-col items-center justify-between w-0 self-stretch z-10">
        <div className="size-5 -mt-2.5 rounded-full bg-background border border-border shadow-inner" />
        <div className="h-full border-r-2 border-dashed border-border/70 my-2" />
        <div className="size-5 -mb-2.5 rounded-full bg-background border border-border shadow-inner" />
      </div>

      {/* Mobile Perforation (Horizontal) */}
      <div className="relative flex md:hidden items-center justify-between h-0 w-full z-10">
        <div className="size-5 -ml-2.5 rounded-full bg-background border border-border shadow-inner" />
        <div className="w-full border-b-2 border-dashed border-border/70 mx-2" />
        <div className="size-5 -mr-2.5 rounded-full bg-background border border-border shadow-inner" />
      </div>

      {/* RIGHT SECTION: Ticket Stub */}
      <div className="flex flex-col justify-between p-4 sm:p-5 bg-secondary/20 md:w-60 shrink-0 gap-3 border-t md:border-t-0 border-border/60">
        {/* Status Badge */}
        <div className="flex items-center justify-between md:justify-end">
          <span className="md:hidden text-[11px] font-sans text-muted-foreground">
            Status Tiket
          </span>
          {statusBadge.variant === "active" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <StatusIcon className="size-3.5" />
              {statusBadge.label}
            </span>
          )}
          {statusBadge.variant === "redeemed" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
              <StatusIcon className="size-3.5" />
              {statusBadge.label}
            </span>
          )}
          {statusBadge.variant === "cancelled" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
              <StatusIcon className="size-3.5" />
              {statusBadge.label}
            </span>
          )}
          {statusBadge.variant === "past" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
              <StatusIcon className="size-3.5" />
              {statusBadge.label}
            </span>
          )}
        </div>

        {/* Ticket Code Box */}
        <div className="rounded-xl border border-border/70 bg-card p-2.5 text-center shadow-2xs">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans block">
            Kode Tiket
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-foreground select-all">
            {ticket.ticketCode}
          </span>
        </div>

        {/* Button to open E-Ticket Modal */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(ticket);
          }}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl h-9 gap-1.5 shadow-2xs"
        >
          <QrCode className="size-3.5" />
          Lihat E-Tiket
        </Button>
      </div>
    </div>
  );
}
