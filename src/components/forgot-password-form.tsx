"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO:
    // Kirim email ke backend NestJS
    // Backend akan mengirim OTP ke email user
    //
    // Contoh nanti:
    // await forgotPassword(email)

    window.location.href = "/auth/forgot-password/otp";
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-heading">
            Lupa Password?
          </h1>

          <p className="font-sans text-sm text-muted-foreground">
            Masukkan email yang terdaftar untuk menerima kode OTP.
          </p>
        </div>

        <Field>
          <FieldLabel className="font-sans" htmlFor="email">
            Email
          </FieldLabel>

          <Input
            className="font-sans"
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </Field>

        <Field>
          <Button className="font-sans" type="submit">
            Kirim OTP
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center font-sans">
            Ingat password kamu?{" "}
            <a
              href="/auth/login"
              className="underline text-primary underline-offset-4"
            >
              Kembali ke Login
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}