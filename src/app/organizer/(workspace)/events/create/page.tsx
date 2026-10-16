"use client";

import { useEffect, useState, useId } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarPlus,
  Image as ImageIcon,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Search,
  UserCheck,
  AlertCircle,
  Sparkles,
  Send,
  Save,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { organizerFetch, OrganizerApiError } from "@/lib/organizer-api";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface TicketTierInput {
  tempId: string;
  name: string;
  price: string;
  quota: string;
}

interface SearchUser {
  id: string;
  email: string;
  fullName: string;
  avatar?: string | null;
  role: string;
}

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function CreateEventWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form State - Step 1: Basics
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [venueImage, setVenueImage] = useState<File | null>(null);
  const [venuePreview, setVenuePreview] = useState<string | null>(null);

  // Form State - Step 2: Date & Location
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [isRefundable, setIsRefundable] = useState(true);

  // Form State - Step 3: Ticket Tiers
  const [ticketTiers, setTicketTiers] = useState<TicketTierInput[]>([
    { tempId: "tier-1", name: "General Admission", price: "50000", quota: "100" },
  ]);

  // Form State - Step 4: Event Staff
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<SearchUser[]>([]);

  // Submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMode, setSubmissionMode] = useState<"DRAFT" | "SUBMIT" | null>(null);

  // Load categories
  useEffect(() => {
    async function loadCats() {
      try {
        const res: any = await organizerFetch("/categories");
        const list = Array.isArray(res) ? res : res.data || [];
        setCategories(list);
        if (list.length > 0 && !categoryId) {
          setCategoryId(list[0].id);
        }
      } catch {
        toast.error("Failed to load event categories");
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCats();
  }, [categoryId]);

  // Handle Cover Image Selection
  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Cover image exceeds 5MB limit");
        return;
      }
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  // Handle Venue Image Selection
  function handleVenueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Venue image exceeds 5MB limit");
        return;
      }
      setVenueImage(file);
      setVenuePreview(URL.createObjectURL(file));
    }
  }

  // Ticket Tiers Helpers
  function addTicketTier() {
    setTicketTiers((prev) => [
      ...prev,
      {
        tempId: `tier-${Date.now()}`,
        name: "",
        price: "",
        quota: "",
      },
    ]);
  }

  function updateTicketTier(tempId: string, field: "name" | "price" | "quota", value: string) {
    setTicketTiers((prev) =>
      prev.map((tier) => (tier.tempId === tempId ? { ...tier, [field]: value } : tier))
    );
  }

  function removeTicketTier(tempId: string) {
    if (ticketTiers.length <= 1) {
      toast.error("You must have at least one ticket tier");
      return;
    }
    setTicketTiers((prev) => prev.filter((tier) => tier.tempId !== tempId));
  }

  // Search Staff Users
  async function handleSearchUsers(query: string) {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res: any = await organizerFetch(
        `/events/search-invitable-users?search=${encodeURIComponent(query.trim())}&limit=8`
      );
      const list = res.data || [];
      // Filter out users already in selectedStaff
      const existingIds = new Set(selectedStaff.map((u) => u.id));
      setSearchResults(list.filter((u: SearchUser) => !existingIds.has(u.id)));
    } catch {
      // ignore
    } finally {
      setIsSearching(false);
    }
  }

  function addStaff(user: SearchUser) {
    setSelectedStaff((prev) => [...prev, user]);
    setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
    setSearchQuery("");
  }

  function removeStaff(userId: string) {
    setSelectedStaff((prev) => prev.filter((u) => u.id !== userId));
  }

  // Step Validation Before Navigating Forward
  function validateCurrentStep(): boolean {
    if (currentStep === 1) {
      if (!title.trim()) {
        toast.error("Please enter an event title");
        return false;
      }
      if (!categoryId) {
        toast.error("Please select a category");
        return false;
      }
      if (!description.trim()) {
        toast.error("Please enter an event description");
        return false;
      }
      if (!coverImage) {
        toast.error("Cover image is required");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!startDatetime) {
        toast.error("Start date and time is required");
        return false;
      }
      if (!endDatetime) {
        toast.error("End date and time is required");
        return false;
      }
      const start = new Date(startDatetime);
      const end = new Date(endDatetime);
      if (start >= end) {
        toast.error("End time must be strictly after start time");
        return false;
      }
      if (!location.trim()) {
        toast.error("Event venue/location is required");
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (ticketTiers.length === 0) {
        toast.error("Please add at least one ticket tier");
        return false;
      }
      for (const tier of ticketTiers) {
        if (!tier.name.trim()) {
          toast.error("Each ticket tier must have a name");
          return false;
        }
        const price = Number(tier.price);
        if (isNaN(price) || price < 0) {
          toast.error(`Invalid price for tier "${tier.name || 'Unnamed'}"`);
          return false;
        }
        const quota = Number(tier.quota);
        if (isNaN(quota) || quota < 1) {
          toast.error(`Quota must be at least 1 for tier "${tier.name}"`);
          return false;
        }
      }
      return true;
    }

    return true;
  }

  function goNext() {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Final Submission Orchestration
  async function handleFinalSubmit(mode: "DRAFT" | "SUBMIT") {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setSubmissionMode(mode);

    try {
      // 1. Create Event with Multipart FormData
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("categoryId", categoryId);
      formData.append("startDatetime", new Date(startDatetime).toISOString());
      formData.append("endDatetime", new Date(endDatetime).toISOString());
      formData.append("location", location.trim());
      formData.append("isRefundable", isRefundable ? "true" : "false");

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }
      if (venueImage) {
        formData.append("venueImage", venueImage);
      }

      // Add invited user IDs
      if (selectedStaff.length > 0) {
        formData.append(
          "invitedUserIds",
          JSON.stringify(selectedStaff.map((u) => u.id))
        );
      }

      const eventRes: any = await organizerFetch("/events", {
        method: "POST",
        body: formData,
      });

      const createdEventId = eventRes?.event?.id;
      if (!createdEventId) {
        throw new Error("Event created but ID was not returned");
      }

      // 2. Create Ticket Tiers
      for (const tier of ticketTiers) {
        await organizerFetch(`/ticket-types/event/${createdEventId}`, {
          method: "POST",
          body: JSON.stringify({
            name: tier.name.trim(),
            price: Number(tier.price),
            quota: Number(tier.quota),
          }),
        });
      }

      // 3. Submit for Review if requested
      if (mode === "SUBMIT") {
        await organizerFetch(`/events/${createdEventId}/submit`, {
          method: "PATCH",
        });
        toast.success("Event created and submitted for review successfully!");
        router.push("/organizer/events");
      } else {
        toast.success("Event draft saved successfully!");
        router.push(`/organizer/events/${createdEventId}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmissionMode(null);
    }
  }

  const steps = [
    { num: 1, title: "Basics" },
    { num: 2, title: "Schedule & Venue" },
    { num: 3, title: "Tickets & Pricing" },
    { num: 4, title: "Event Team" },
    { num: 5, title: "Review & Submit" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create New Event
          </h1>
          <p className="mt-1 font-sans text-xs text-muted-foreground sm:text-sm">
            Step-by-step wizard to craft and publish your event on Festix.
          </p>
        </div>
        <Link
          href="/organizer/events"
          className="rounded-xl border border-border px-3.5 py-1.5 font-sans text-xs font-semibold text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          Cancel
        </Link>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-5 gap-2">
        {steps.map((s) => {
          const isDone = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <div
              key={s.num}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all text-center ${
                isCurrent
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : isDone
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              <div
                className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <CheckCircle2 className="size-3.5" /> : s.num}
              </div>
              <span className="hidden font-sans text-[11px] sm:inline truncate w-full">
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content Container */}
      <Card className="rounded-3xl border border-border bg-card shadow-xs">
        <CardContent className="p-6 sm:p-8">
          {/* STEP 1: BASICS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">Step 1: Event Basics</h2>
                <p className="font-sans text-xs text-muted-foreground">
                  Give your event a clear title, category, and visual identity.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-sans text-xs font-semibold">
                    Event Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Jakarta Soundwave Music Festival 2026"
                    className="mt-1.5 h-11 rounded-xl font-sans text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="font-sans text-xs font-semibold">
                    Event Category *
                  </Label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-card px-3 py-2 font-sans text-sm text-foreground shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="description" className="font-sans text-xs font-semibold">
                    Event Description *
                  </Label>
                  <textarea
                    id="description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what attendees can expect, lineup, guidelines, and key highlights..."
                    className="mt-1.5 w-full rounded-xl border border-input bg-card p-3 font-sans text-sm text-foreground shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {/* Cover Image Dropzone */}
                <div>
                  <Label className="font-sans text-xs font-semibold">Cover Image (Poster) *</Label>
                  <div className="mt-1.5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-5 text-center transition-colors hover:border-primary/50">
                    {coverPreview ? (
                      <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border bg-black shadow-sm">
                        <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImage(null);
                            setCoverPreview(null);
                          }}
                          className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center gap-2">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <ImageIcon className="size-6" />
                        </div>
                        <span className="font-sans text-xs font-semibold text-primary">Click to upload poster</span>
                        <span className="font-sans text-[11px] text-muted-foreground">
                          Recommended ratio 16:9 • JPG, PNG, WEBP up to 5MB
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleCoverChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Optional Venue Image */}
                <div>
                  <Label className="font-sans text-xs font-semibold">Venue Map / Layout (Optional)</Label>
                  <div className="mt-1.5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-4 text-center transition-colors hover:border-primary/50">
                    {venuePreview ? (
                      <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border bg-black shadow-sm">
                        <Image src={venuePreview} alt="Venue preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setVenueImage(null);
                            setVenuePreview(null);
                          }}
                          className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center gap-1.5">
                        <span className="font-sans text-xs font-semibold text-primary">Upload venue seating or stage layout</span>
                        <span className="font-sans text-[11px] text-muted-foreground">Optional • Max 5MB</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleVenueChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULE & VENUE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">Step 2: Schedule & Venue</h2>
                <p className="font-sans text-xs text-muted-foreground">
                  Specify when and where the event takes place.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="startDatetime" className="font-sans text-xs font-semibold">
                      Start Date & Time *
                    </Label>
                    <Input
                      id="startDatetime"
                      type="datetime-local"
                      value={startDatetime}
                      onChange={(e) => setStartDatetime(e.target.value)}
                      className="mt-1.5 h-11 rounded-xl font-sans text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDatetime" className="font-sans text-xs font-semibold">
                      End Date & Time *
                    </Label>
                    <Input
                      id="endDatetime"
                      type="datetime-local"
                      value={endDatetime}
                      onChange={(e) => setEndDatetime(e.target.value)}
                      className="mt-1.5 h-11 rounded-xl font-sans text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="font-sans text-xs font-semibold">
                    Venue / Location Address *
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Istora Senayan, Gelora Bung Karno, Jakarta"
                    className="mt-1.5 h-11 rounded-xl font-sans text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 p-4">
                  <input
                    type="checkbox"
                    id="isRefundable"
                    checked={isRefundable}
                    onChange={(e) => setIsRefundable(e.target.checked)}
                    className="size-4.5 rounded border-gray-300 text-primary accent-primary"
                  />
                  <div>
                    <Label htmlFor="isRefundable" className="cursor-pointer font-sans text-sm font-semibold">
                      Allow Ticket Refunds
                    </Label>
                    <p className="font-sans text-xs text-muted-foreground">
                      If enabled, customers can request refunds according to platform terms prior to the event.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TICKETS & PRICING */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">Step 3: Tickets & Pricing</h2>
                  <p className="font-sans text-xs text-muted-foreground">
                    Define ticket categories, pricing, and attendee capacities.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTicketTier}
                  className="gap-1.5 rounded-xl font-sans text-xs font-semibold"
                >
                  <Plus className="size-3.5" /> Add Tier
                </Button>
              </div>

              <div className="space-y-4">
                {ticketTiers.map((tier, idx) => (
                  <div
                    key={tier.tempId}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-end"
                  >
                    <div className="flex-1">
                      <Label className="font-sans text-xs font-semibold">Tier Name *</Label>
                      <Input
                        value={tier.name}
                        onChange={(e) => updateTicketTier(tier.tempId, "name", e.target.value)}
                        placeholder="e.g. Early Bird, VIP"
                        className="mt-1 h-10 rounded-xl font-sans text-xs"
                      />
                    </div>

                    <div className="w-full sm:w-44">
                      <Label className="font-sans text-xs font-semibold">Price (IDR) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        value={tier.price}
                        onChange={(e) => updateTicketTier(tier.tempId, "price", e.target.value)}
                        placeholder="0 for Free"
                        className="mt-1 h-10 rounded-xl font-sans text-xs"
                      />
                    </div>

                    <div className="w-full sm:w-36">
                      <Label className="font-sans text-xs font-semibold">Quota *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={tier.quota}
                        onChange={(e) => updateTicketTier(tier.tempId, "quota", e.target.value)}
                        placeholder="100"
                        className="mt-1 h-10 rounded-xl font-sans text-xs"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTicketTier(tier.tempId)}
                      className="size-10 shrink-0 text-muted-foreground hover:text-destructive"
                      disabled={ticketTiers.length <= 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: EVENT TEAM */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">Step 4: Event Staff Team</h2>
                <p className="font-sans text-xs text-muted-foreground">
                  Invite verified users to join your on-ground event crew for ticket check-in.
                </p>
              </div>

              {/* Informational banner on activation lifecycle */}
              <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs font-sans text-foreground">
                <Sparkles className="size-5 shrink-0 text-primary" />
                <div>
                  <span className="font-semibold text-primary">Activation Lifecycle: </span>
                  Selected crew members will be invited with pending status. Once the administrator approves your event, eligible members are automatically assigned and granted check-in access for this event.
                </div>
              </div>

              {/* Search User Input */}
              <div className="space-y-2">
                <Label className="font-sans text-xs font-semibold">Search Eligible Users by Email or Name</Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => handleSearchUsers(e.target.value)}
                    placeholder="Type name or email to search verified users..."
                    className="h-11 rounded-xl pl-10 pr-4 font-sans text-xs"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                </div>

                {/* Dropdown Results */}
                {searchResults.length > 0 && (
                  <div className="divide-y divide-border/60 rounded-xl border border-border bg-card shadow-md">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-sans text-xs font-bold text-foreground">{user.fullName}</p>
                          <p className="font-sans text-[11px] text-muted-foreground">{user.email}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => addStaff(user)}
                          className="h-8 rounded-lg px-3 font-sans text-xs gap-1"
                        >
                          <Plus className="size-3" /> Select
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Staff Chips */}
              <div className="space-y-2">
                <Label className="font-sans text-xs font-semibold">
                  Selected Event Crew ({selectedStaff.length})
                </Label>
                {selectedStaff.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                    <Users className="mx-auto size-7 text-muted-foreground/60" />
                    <p className="mt-1 font-sans text-xs text-muted-foreground">
                      No staff members selected yet. You can also invite staff later from the event workspace.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {selectedStaff.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-sans text-xs font-bold text-primary">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 truncate">
                            <p className="font-sans text-xs font-bold text-foreground truncate">{user.fullName}</p>
                            <p className="font-sans text-[11px] text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStaff(user.id)}
                          className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & CONFIRM */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">Step 5: Review & Submit</h2>
                <p className="font-sans text-xs text-muted-foreground">
                  Review all details before creating your event. You can save as a draft or submit directly for admin review.
                </p>
              </div>

              {/* Event Preview Card */}
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                {coverPreview && (
                  <div className="relative aspect-video w-full bg-black">
                    <Image src={coverPreview} alt="Cover Preview" fill className="object-cover" />
                  </div>
                )}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-primary">
                      {categories.find((c) => c.id === categoryId)?.name || "Category"}
                    </span>
                    <h3 className="mt-2 font-heading text-xl font-bold text-foreground">{title}</h3>
                    <p className="mt-1 line-clamp-3 font-sans text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 rounded-xl border bg-muted/20 p-3 sm:grid-cols-2 font-sans text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-primary" />
                      <span>{startDatetime ? formatDate(startDatetime) : "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span className="truncate">{location || "Not set"}</span>
                    </div>
                  </div>

                  {/* Tiers Summary */}
                  <div>
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Configured Tickets ({ticketTiers.length} tiers)
                    </h4>
                    <div className="mt-2 divide-y divide-border/60 rounded-xl border">
                      {ticketTiers.map((t) => (
                        <div key={t.tempId} className="flex items-center justify-between p-2.5 font-sans text-xs">
                          <span className="font-semibold text-foreground">{t.name}</span>
                          <span className="text-muted-foreground">
                            {Number(t.price) === 0 ? "Free" : `IDR ${Number(t.price).toLocaleString()}`} • {t.quota} tickets
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff Summary */}
                  {selectedStaff.length > 0 && (
                    <div>
                      <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Staff Invitees ({selectedStaff.length} crew)
                      </h4>
                      <p className="mt-1 font-sans text-xs text-muted-foreground">
                        {selectedStaff.map((s) => s.fullName).join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isSubmitting}
                className="gap-1.5 rounded-xl font-sans text-xs"
              >
                <ChevronLeft className="size-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={goNext}
                className="gap-1.5 rounded-xl font-sans text-xs font-semibold"
              >
                Continue <ChevronRight className="size-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleFinalSubmit("DRAFT")}
                  disabled={isSubmitting}
                  className="gap-1.5 rounded-xl font-sans text-xs font-semibold"
                >
                  {isSubmitting && submissionMode === "DRAFT" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  Save as Draft
                </Button>

                <Button
                  type="button"
                  onClick={() => handleFinalSubmit("SUBMIT")}
                  disabled={isSubmitting}
                  className="gap-1.5 rounded-xl bg-primary font-sans text-xs font-semibold text-primary-foreground hover:bg-primary/95"
                >
                  {isSubmitting && submissionMode === "SUBMIT" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                  Submit for Review
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
