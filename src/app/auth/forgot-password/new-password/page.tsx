import { Suspense } from "react";
import { NewPasswordForm } from "@/components/new-password-form";
import Link from "next/link";

export default function NewPasswordPage() {
  return (
    <div className="min-h-svh bg-muted flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/landing-page" className="font-heading text-xl font-bold text-foreground">
            Tixora<span className="text-primary">.</span>
          </Link>
        </div>

        <div className="rounded-xl bg-white border border-border shadow-sm p-8">
          <Suspense>
            <NewPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
