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
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function NewPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChanges({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    if (!email) {
      toast.error("Email tidak ditemukan. Silakan ulangi dari halaman lupa password.", {
        position: "top-center",
      });
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Password dan konfirmasi password wajib diisi", {
        position: "top-center",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password minimal 8 karakter", {
        position: "top-center",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Reset password gagal", {
          position: "top-center",
        });
        return;
      }

      toast.success("Password berhasil direset! Silakan login.", {
        position: "top-center",
      });
      router.push("/auth/login");
    } catch {
      toast.error("Gagal reset password. Silakan coba lagi.", {
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
            value={formData.password}
            onChange={(e) => handleInputChanges(e.target)}
          />
        </Field>

        <Field>
          <FieldLabel className="font-sans" htmlFor="confirm-password">
            Konfirmasi Password
          </FieldLabel>

          <Input
            className="font-sans"
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleInputChanges(e.target)}
          />
        </Field>

        <Field>
          <Button className="font-sans" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
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
