import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
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
            <RegisterForm />
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-[#0D1B2E] lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, #0099FF 0%, transparent 50%), radial-gradient(circle at 20% 80%, #38BDF8 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10 max-w-xs text-center px-8">
          <p className="font-heading text-3xl font-bold text-white leading-snug">
            Mulai perjalanan eventmu hari ini.
          </p>
          <p className="mt-4 font-sans text-sm text-white/50">
            Buat akun gratis dan dapatkan akses ke ribuan event di seluruh
            Indonesia.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/30" />
      </div>
    </div>
  );
}
