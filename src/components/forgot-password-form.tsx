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
import { API_URL } from "../../api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!email) {
      toast.error("Email tidak boleh kosong", { position: "top-center" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Gagal mengirim OTP", {
          position: "top-center",
        });
        return;
      }

      toast.success("Kode OTP telah dikirim ke email kamu", {
        position: "top-center",
      });
      router.push(
        `/auth/forgot-password/otp?email=${encodeURIComponent(data.email || email)}`,
      );
    } catch {
      toast.error("Gagal mengirim OTP. Silakan coba lagi.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <Button className="font-sans" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
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