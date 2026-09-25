"use client";

import { ShieldAlert, AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface DashboardErrorProps {
  status?: number;
  message?: string;
  onRetry?: () => void;
}

export function DashboardErrorView({
  status,
  message,
  onRetry,
}: DashboardErrorProps) {
  const router = useRouter();

  if (status === 403) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="max-w-md rounded-2xl border-destructive/20 text-center">
          <CardContent className="space-y-4 py-8">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <ShieldAlert className="size-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-bold">Access Denied</h2>
              <p className="font-sans text-sm text-muted-foreground">
                You do not have permission to view the Admin Dashboard. This
                section is restricted to administrators.
              </p>
            </div>
            <Button
              onClick={() => router.push("/customers/home")}
              className="mt-2"
            >
              <Home className="size-4" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="max-w-md rounded-2xl text-center">
        <CardContent className="space-y-4 py-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-heading text-lg font-bold">
              Unable to load dashboard
            </h2>
            <p className="font-sans text-sm text-muted-foreground">
              {message || "An unexpected error occurred while fetching dashboard data."}
            </p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="mt-2">
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
