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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const OTP_DURATION = 900;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function OtpForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
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
  }, []);

  async function handleSubmit() {
    if (!email) {
      toast.error("Email tidak ditemukan. Silakan ulangi dari halaman lupa password.", {
        position: "top-center",
      });
      return;
    }

    if (code.length !== 6) {
      toast.error("Kode OTP harus 6 digit", { position: "top-center" });
      return;
    }

    if (timeLeft <= 0) {
      toast.error("Kode OTP telah kedaluwarsa. Silakan kirim ulang OTP.", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Verifikasi OTP gagal", {
          position: "top-center",
        });
        return;
      }

      toast.success("OTP berhasil diverifikasi", { position: "top-center" });
      router.push(
        `/auth/forgot-password/new-password?email=${encodeURIComponent(data.email || email)}`,
      );
    } catch {
      toast.error("Gagal memverifikasi OTP. Silakan coba lagi.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      toast.error("Email tidak ditemukan. Silakan ulangi dari halaman lupa password.", {
        position: "top-center",
      });
      return;
    }

    setIsResending(true);

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
        toast.error(data.message || "Gagal mengirim ulang OTP", {
          position: "top-center",
        });
        return;
      }

      setCode("");
      setTimeLeft(OTP_DURATION);
      toast.success("OTP baru telah dikirim ke email kamu", {
        position: "top-center",
      });
    } catch {
      toast.error("Gagal mengirim ulang OTP. Silakan coba lagi.", {
        position: "top-center",
      });
    } finally {
      setIsResending(false);
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
          <h1 className="text-2xl font-bold font-heading">Verifikasi OTP</h1>

          <p className="font-sans text-sm text-muted-foreground">
            Masukkan kode OTP yang telah dikirim ke email kamu.
          </p>
        </div>

        <Field>
          <FieldLabel className="font-sans" htmlFor="otp-code">
            Kode OTP
          </FieldLabel>
          <Input
            className="font-sans tracking-[0.3em] text-center"
            id="otp-code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
        </Field>

        <div className="text-center font-sans text-sm text-muted-foreground">
          {timeLeft <= 0 ? (
            <span className="text-destructive">Kode OTP telah kedaluwarsa</span>
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
          <Button className="font-sans" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Verifikasi
          </Button>
        </Field>

        <FieldDescription className="text-center font-sans">
          Tidak menerima kode?{" "}
          <button
            type="button"
            className="text-primary underline underline-offset-4 disabled:opacity-50"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? "Mengirim..." : "Kirim ulang"}
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
