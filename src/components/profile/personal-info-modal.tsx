"use client";

import { useState } from "react";
import { Mail, Pencil, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateMe, type CurrentUser } from "@/lib/auth-api";

type PersonalInfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: CurrentUser | null;
  onUserUpdate: (updated: CurrentUser) => void;
};

export function PersonalInfoModal({
  open,
  onOpenChange,
  user,
  onUserUpdate,
}: PersonalInfoModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(user?.fullName || "");
  const [isSaving, setIsSaving] = useState(false);

  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "Customer");
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  function handleStartEdit() {
    setFullNameInput(user?.fullName || "");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setFullNameInput(user?.fullName || "");
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = fullNameInput.trim();
    if (!trimmed) {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateMe({ fullName: trimmed });
      onUserUpdate(updated);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogTitle className="flex items-center gap-2">
          <UserIcon className="size-4 text-primary" />
          Personal Information
        </DialogTitle>
        <DialogDescription>
          View and manage your personal details and account credentials.
        </DialogDescription>

        {!isEditing ? (
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3.5 rounded-2xl border p-4">
              <Avatar className="size-14 rounded-2xl border-2 border-primary/20">
                {user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
                <AvatarFallback className="rounded-2xl bg-primary/15 font-heading text-lg font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate font-heading text-base font-bold text-foreground">
                    {displayName}
                  </h4>
                  <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">
                    {user?.role || "USER"}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate font-sans text-xs text-muted-foreground">
                  User ID: {user?.userId ? `${user.userId.slice(0, 8)}...` : "--"}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border bg-muted/20 p-4 font-sans text-xs">
              <div className="flex items-start justify-between border-b pb-3">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-semibold text-foreground text-right">
                  {user?.fullName || "Not set"}
                </span>
              </div>

              <div className="flex items-start justify-between border-b pb-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="size-3.5 text-primary" /> Email Address
                </span>
                <span className="font-semibold text-foreground text-right truncate max-w-[200px]">
                  {user?.email || "--"}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield className="size-3.5 text-primary" /> Account Role
                </span>
                <span className="font-semibold text-foreground text-right">
                  {user?.role || "USER"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <DialogClose render={<Button type="button" variant="outline" size="sm" />}>
                Close
              </DialogClose>

              <Button
                type="button"
                size="sm"
                onClick={handleStartEdit}
                className="gap-1.5"
              >
                <Pencil className="size-3.5" />
                Change Information
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div>
              <label className="font-sans text-xs font-medium text-foreground">
                Email Address
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-1.5 opacity-60 font-sans text-xs"
              />
              <span className="font-sans text-[11px] text-muted-foreground">
                Email address is permanently linked and cannot be modified.
              </span>
            </div>

            <div>
              <label className="font-sans text-xs font-medium text-foreground">
                Full Name
              </label>
              <Input
                type="text"
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1.5 font-sans text-xs"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogPopup>
    </Dialog>
  );
}
