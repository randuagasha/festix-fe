"use client";

import { useRef, useState } from "react";
import { Camera, Mail, Pencil, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateMe, type CurrentUser } from "@/lib/auth-api";

type ProfileHeaderProps = {
  user: CurrentUser | null;
  onUserUpdate: (updated: CurrentUser) => void;
};

export function ProfileHeader({ user, onUserUpdate }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(user?.fullName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const displayName =
    user?.fullName || (user?.email ? user.email.split("@")[0] : "User");
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  async function handleAvatarSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar size must be less than 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const updated = await updateMe({ avatar: file });
      onUserUpdate(updated);
      toast.success("Profile photo updated");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile photo";
      toast.error(message);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSaveProfile(event: React.FormEvent) {
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
      setDialogOpen(false);
      toast.success("Profile updated");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border bg-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarSelected}
      />

      <div className="h-28 bg-primary/10 sm:h-36" />

      <div className="px-5 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative">
              <Avatar className="size-28 rounded-3xl border-4 border-card sm:size-32">
                {user?.avatar && (
                  <AvatarImage src={user.avatar} alt={displayName} />
                )}
                <AvatarFallback className="rounded-3xl bg-primary/15 font-heading text-3xl font-bold text-primary sm:text-4xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
                aria-label="Change profile picture"
              >
                <Camera className="size-4" />
              </button>
            </div>

            <div className="pb-1">
              <h2 className="font-heading text-2xl font-bold">{displayName}</h2>
              <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-wider text-primary">
                {user?.role || "USER"}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full font-sans sm:w-auto"
            onClick={() => {
              setFullNameInput(user?.fullName || "");
              setDialogOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Edit Profile
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:flex-wrap sm:gap-6">
          <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
            <Mail className="size-4 text-primary" />
            {user?.email || "No email available"}
          </div>
          <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
            <UserRound className="size-4 text-primary" />
            ID: {user?.userId ? `${user.userId.slice(0, 8)}...` : "--"}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogPopup className="max-w-md">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your account information. Changes will take effect across the platform.
          </DialogDescription>

          <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
            <div>
              <label className="font-sans text-xs font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-1.5 opacity-60"
              />
              <span className="font-sans text-[11px] text-muted-foreground">
                Email address cannot be changed.
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
                className="mt-1.5"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <DialogClose render={<Button type="button" variant="outline" size="sm" />}>
                Cancel
              </DialogClose>
              <Button type="submit" size="sm" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </Dialog>
    </section>
  );
}