import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium font-heading"
          >
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Festix.
          </Link>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}