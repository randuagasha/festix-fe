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

export function NewPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kirim password baru ke backend NestJS
    //
    // Contoh nanti:
    // await resetPassword({
    //   password,
    //   confirmPassword,
    // })

    window.location.href = "/auth/login";
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
            Buat Password Baru
          </h1>

          <p className="font-sans text-sm text-muted-foreground">
            Buat password baru untuk mengamankan akun kamu.
          </p>
        </div>

        <Field>
          <FieldLabel className="font-sans" htmlFor="password">
            Password Baru
          </FieldLabel>

          <Input
            className="font-sans"
            id="password"
            name="password"
            type="password"
            required
          />
        </Field>

        <Field>
          <FieldLabel className="font-sans" htmlFor="confirm-password">
            Konfirmasi Password
          </FieldLabel>

          <Input
            className="font-sans"
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
          />
        </Field>

        <Field>
          <Button className="font-sans" type="submit">
            Reset Password
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center font-sans">
            Setelah password berhasil diubah, kamu akan diarahkan ke halaman
            login.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}