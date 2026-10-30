"use client";

import { LogOut, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CurrentUser } from "@/lib/auth-api";

type StaffProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: CurrentUser | null;
  onLogout: () => void;
};

export function StaffProfileModal({
  open,
  onOpenChange,
  user,
  onLogout,
}: StaffProfileModalProps) {
  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Staff Member");
  const userInitial = displayName.charAt(0).toUpperCase() || "S";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogTitle className="flex items-center gap-2">
          <UserIcon className="size-4 text-primary" />
          Staff Operational Profile
        </DialogTitle>
        <DialogDescription>
          Authenticated operational account details and event check-in role.
        </DialogDescription>

        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border p-4">
            <Avatar className="size-14 rounded-2xl border-2 border-primary/20">
              {user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
              <AvatarFallback className="rounded-2xl bg-primary/15 font-heading text-lg font-bold text-primary">
                {userInitial}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate font-heading text-base font-bold text-foreground">
                  {displayName}
                </h4>
                <Badge variant="secondary" className="gap-1 border-primary/20 bg-primary/10 text-primary">
                  <ShieldCheck className="size-3" />
                  STAFF
                </Badge>
              </div>

              <div className="mt-1 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{user?.email || "No email available"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed bg-muted/20 p-3.5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Operational Permissions</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4">
              <li>Scan and validate attendee ticket QR codes</li>
              <li>Redeem issued tickets for assigned events</li>
              <li>Monitor real-time event check-in and attendance progress</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <DialogClose render={<Button type="button" variant="outline" size="sm" />}>
            Close
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onLogout}
            className="gap-1.5"
          >
            <LogOut className="size-3.5" />
            Sign out
          </Button>
        </div>
      </DialogPopup>
    </Dialog>
  );
}
