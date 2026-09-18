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
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const OTP_DURATION = 300;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft]);

  async function handleSubmit() {
    if (!email) {
      toast.error("Email tidak boleh kosong", { position: "top-center" });
      return;
    }

    if (code.length !== 6) {
      toast.error("Kode OTP harus 6 digit", { position: "top-center" });
      return;
    }

    if (timeLeft <= 0) {
      toast.error("Kode OTP telah kedaluwarsa. Silakan daftar ulang.", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 409 &&
          data.message === "Email Already Verified"
        ) {
          toast.info("Email sudah diverifikasi. Silakan login.", {
            position: "top-center",
          });
          router.push("/auth/login");
          return;
        }

        toast.error(data.message || "Verifikasi gagal", {
          position: "top-center",
        });
        return;
      }

      toast.success("Email berhasil diverifikasi! Silakan login.", {
        position: "top-center",
      });
      router.push("/auth/login");
    } catch {
      toast.error("Gagal memverifikasi email. Silakan coba lagi.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const expired = timeLeft <= 0;

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
          <h1 className="text-2xl font-bold font-heading">Verifikasi Email</h1>
          <p className="font-sans text-sm text-muted-foreground">
            Masukkan kode 6 digit yang telah dikirim ke email kamu.
          </p>
        </div>

        <Field>
          <FieldLabel className="font-sans" htmlFor="verify-email">
            Email
          </FieldLabel>
          <Input
            className="font-sans"
            id="verify-email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!!emailFromQuery}
          />
        </Field>

        <Field>
          <FieldLabel className="font-sans" htmlFor="verify-code">
            Kode Verifikasi
          </FieldLabel>
          <Input
            className="font-sans tracking-[0.3em] text-center"
            id="verify-code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            required
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(val);
            }}
          />
        </Field>

        <div className="text-center font-sans text-sm text-muted-foreground">
          {expired ? (
            <span className="text-destructive">
              Kode verifikasi telah kedaluwarsa
            </span>
          ) : (
            <span>
              Kode kedaluwarsa dalam{" "}
              <span className="font-semibold text-foreground">
                {formatTime(timeLeft)}
              </span>
            </span>
          )}
        </div>

        <Field>
          <Button
            className="font-sans"
            type="submit"
            disabled={isLoading || expired}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Verifikasi Email
          </Button>
        </Field>

        {expired && (
          <FieldDescription className="text-center font-sans">
            Kode kedaluwarsa?{" "}
            <a
              href="/auth/register"
              className="underline text-primary underline-offset-4"
            >
              Daftar ulang
            </a>
          </FieldDescription>
        )}

        <FieldDescription className="text-center font-sans">
          Sudah terverifikasi?{" "}
          <a
            href="/auth/login"
            className="underline text-primary underline-offset-4"
          >
            Login
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
