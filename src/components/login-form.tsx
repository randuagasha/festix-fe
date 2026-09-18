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
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function resetForm() {
    setFormData({
      email: "",
      password: "",
    });
  }

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
    if (!formData.email || !formData.password) {
      toast.error("Please Fill in All The Fields", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Email not Verified") {
          toast.error("Email belum diverifikasi. Silakan verifikasi terlebih dahulu.", {
            position: "top-center",
          });
          router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
          return;
        }

        toast.error(data.message || "Login failed", {
          position: "top-center",
        });
        return;
      }

      toast.success("Berhasil Login Akun!", {
        position: "top-center",
      });

      resetForm();

      Cookies.set("token", data.access_token, { expires: 1 });

      if (data.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (data.role === "STAFF") {
        router.push("/staff/dashboard");
      } else {
        router.push("/customers/home");
      }
    } catch {
      toast.error("Failed to login, Please try again!", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-heading">Masuk ke akun mu</h1>
          <p className="font-sans text-sm text-muted-foreground">
            Selamat datang kembali! Masuk untuk mengikuti event favoritmu
          </p>
        </div>

        <Field>
          <FieldLabel className="font-sans" htmlFor="email">
            Email
          </FieldLabel>
          <Input
            className="font-sans"
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
            onChange={(e) => handleInputChanges(e.target)}
            value={formData.email}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel className="font-sans" htmlFor="password">
              Password
            </FieldLabel>
            <a
              href="/auth/forgot-password"
              className="ml-auto font-sans text-primary text-sm underline-offset-4 hover:underline">
              Lupa Password?
            </a>
          </div>
          <Input
            className="font-sans"
            id="password"
            type="password"
            name="password"
            required
            onChange={(e) => handleInputChanges(e.target)}
            value={formData.password}
          />
        </Field>

        <Field>
          <Button className="font-sans" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Login
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center font-sans">
            Belum memiliki akun?{" "}
            <a
              href="/auth/register"
              className="underline text-primary underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
