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
import { Checkbox } from "@/components/ui/checkbox";
import { API_URL } from "../../api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  function resetForm() {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setTermsAccepted(false);
    setPrivacyAccepted(false);
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
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please Fill in All The Fields", {
        position: "top-center",
      });
      return;
    }

    if (!termsAccepted) {
      toast.error("Please agree to Festix's Terms & Conditions", {
        position: "top-center",
      });
      return;
    }

    if (!privacyAccepted) {
      toast.error("Please agree to Festix's Privacy Policy", {
        position: "top-center",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password Must Be At Least 8 Characters Long", {
        position: "top-center",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and Confirm Password do not match", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed", {
          position: "top-center",
        });
        return;
      }

      toast.success("Berhasil Register Akun, silahkan Login!", {
        position: "top-center",
      });

      resetForm();
      router.push("/auth/login");
    } catch {
      toast.error("Failed to Create an Account, Please try again!", {
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
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-heading">Buat Akun</h1>
          <p className="font-sans text-sm text-muted-foreground">
            Daftar untuk menggunakan fitur yang tersedia dan mengikuti event favoritmu
          </p>
        </div>

        <Field>
          <FieldLabel className="font-sans" htmlFor="name">
            Nama
          </FieldLabel>
          <Input
            className="font-sans"
            id="name"
            name="fullName"
            type="text"
            placeholder="Enter your name"
            required
            onChange={(e) => handleInputChanges(e.target)}
            value={formData.fullName}
          />
        </Field>

        <Field>
          <FieldLabel className="font-sans" htmlFor="email">
            Email Address
          </FieldLabel>
          <Input
            className="font-sans"
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => handleInputChanges(e.target)}
            value={formData.email}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel className="font-sans" htmlFor="password">
              Buat Password
            </FieldLabel>
          </div>
          <Input
            className="font-sans"
            id="password"
            name="password"
            type="password"
            placeholder="Buat password"
            required
            onChange={(e) => handleInputChanges(e.target)}
            value={formData.password}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel className="font-sans" htmlFor="confirmPassword">
              Konfirmasi Password
            </FieldLabel>
          </div>
          <Input
            className="font-sans"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Konfirmasi password"
            required
            onChange={(e) => handleInputChanges(e.target)}
            value={formData.confirmPassword}
          />
        </Field>

        <Field>
          <Button
            className="font-sans"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create Account
          </Button>
        </Field>

        <FieldGroup className="mx- w-86">
          <Field orientation="horizontal">
            <Checkbox
              id="terms-checkbox-basic"
              name="terms-checkbox-basic"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <FieldLabel
              htmlFor="terms-checkbox-basic"
              className="font-sans font-normal opacity-75"
            >
              I Agree to Festix&apos;s Terms & Conditions.
            </FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="privacy-checkbox-basic"
              name="privacy-checkbox-basic"
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
            />
            <FieldLabel
              htmlFor="privacy-checkbox-basic"
              className="font-sans font-normal opacity-75"
            >
              I Agree to Festix&apos;s Privacy Policy.
            </FieldLabel>
          </Field>
        </FieldGroup>

        <Field>
          <FieldDescription className="text-center font-sans">
            Do you have an account?{" "}
            <a
              href="/auth/login"
              className="underline text-primary underline-offset-4"
            >
              Sign In
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}