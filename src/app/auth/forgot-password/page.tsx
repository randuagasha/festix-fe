import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-svh bg-muted flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/landing-page" className="font-heading text-xl font-bold text-foreground">
            Tixora<span className="text-primary">.</span>
          </Link>
        </div>

        <div className="rounded-xl bg-white border border-border shadow-sm p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
