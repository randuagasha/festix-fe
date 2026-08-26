"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function OtpForm({ className, ...props }: React.ComponentProps<"form">) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ambil OTP dari input
    // Kirim OTP ke backend NestJS untuk diverifikasi
    //
    // Contoh nanti:
    // await verifyOtp(email, otp)

    window.location.href = "/auth/forgot-password/new-password";
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-heading">Verifikasi OTP</h1>

          <p className="font-sans text-sm text-muted-foreground">
            Masukkan kode OTP yang telah dikirim ke email kamu.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <InputOTP maxLength={6} required>
            <InputOTPGroup className="flex gap-3">
              <InputOTPSlot index={0} className="size-12! text-lg font-medium rounded-md! border" />
              <InputOTPSlot index={1} className="size-12! text-lg font-medium rounded-md! border" />
              <InputOTPSlot index={2} className="size-12! text-lg font-medium rounded-md! border" />
              <InputOTPSlot index={3} className="size-12! text-lg font-medium rounded-md! border" />
              <InputOTPSlot index={4} className="size-12! text-lg font-medium rounded-md! border" />
              <InputOTPSlot index={5} className="size-12! text-lg font-medium rounded-md! border" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Field>
          <Button className="font-sans" type="submit">
            Verifikasi
          </Button>
        </Field>

        <FieldDescription className="text-center font-sans">
          Tidak menerima kode?{" "}
          <button
            type="button"
            className="text-primary underline underline-offset-4"
            onClick={() => {
              // TODO:
              // Request resend OTP ke backend
            }}
          >
            Kirim ulang
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
