import Link from "next/link";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Link href="/landing-page" className="font-heading text-xl font-bold text-foreground">
            Tixora<span className="text-primary">.</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Suspense>
              <VerifyEmailForm />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-[#0D1B2E] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 40%, #0099FF 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-xs text-center px-8">
          <p className="font-heading text-3xl font-bold text-white leading-snug">
            Verifikasi emailmu untuk melanjutkan.
          </p>
          <p className="mt-4 font-sans text-sm text-white/50">
            Masukkan kode OTP yang telah kami kirimkan ke emailmu.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/30" />
      </div>
    </div>
  );
}
