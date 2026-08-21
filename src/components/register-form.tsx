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

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
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
            type="text"
            placeholder="Enter your name"
            required
          />
        </Field>
        <Field>
          <FieldLabel className="font-sans " htmlFor="email">
            Email Address
          </FieldLabel>
          <Input
            className="font-sans"
            id="email"
            type="email"
            placeholder="m@example.com"
            required
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
            type="password"
            placeholder="Buat password"
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel className="font-sans" htmlFor="password">
              Konfirmasi Password
            </FieldLabel>
          </div>
          <Input
            className="font-sans"
            id="password"
            type="password"
            placeholder="Konfirmasi password"
            required
          />
        </Field>
        <Field>
          <Button className="font-sans" type="submit">
            Create Account
          </Button>
        </Field>
        <FieldGroup className="mx- w-86 ">
          <Field orientation="horizontal">
            <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
            <FieldLabel htmlFor="terms-checkbox-basic" className="font-sans font-normal opacity-75">
              I Agree to Festix&apos;s Terms & Conditions.
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
            <FieldLabel htmlFor="terms-checkbox-basic" className="font-sans font-normal opacity-75">
              I Agree to Festix&apos;s Privacy Policy.
            </FieldLabel>
          </Field>
        </FieldGroup>
        <Field>
          <FieldDescription className="text-center font-sans ">
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
