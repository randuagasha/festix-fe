"use client";

import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { Skeleton } from "@/components/ui/skeleton";

export function EventDetailSkeleton() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between">
      <HomeNavbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-16 rounded-md" />
            <span className="text-muted-foreground/40">/</span>
            <Skeleton className="h-4 w-20 rounded-md" />
            <span className="text-muted-foreground/40">/</span>
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>

          {/* Hero Poster skeleton */}
          <Skeleton className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl" />

          {/* Main Layout Grid */}
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Column (Content) */}
            <div className="space-y-8 lg:col-span-8">
              {/* Title & Category skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-10 w-3/4 rounded-xl" />
                <Skeleton className="h-5 w-1/2 rounded-lg" />
              </div>

              {/* Quick info cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-3 pt-4">
                <Skeleton className="h-6 w-36 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>

              {/* Terms skeleton */}
              <Skeleton className="h-40 rounded-2xl" />
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-4 space-y-6">
              <Skeleton className="h-80 w-full rounded-3xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
