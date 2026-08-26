import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-heading">Masuk ke akun mu</h1>
          <p className="font-sans text-sm text-muted-foreground">
            Selamat datang kembali! Masuk untuk mengikuti event favoritmu
          </p>
        </div>
        <Field>
          <FieldLabel className="font-sans " htmlFor="email">Email</FieldLabel>
          <Input className="font-sans" id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel className="font-sans" htmlFor="password">Password</FieldLabel>
            <a
              href="/auth/forgot-password"
              className="ml-auto font-sans text-primary text-sm underline-offset-4 hover:underline"
            >
              Lupa Password?
            </a>
          </div>
          <Input className="font-sans" id="password" type="password" required />
        </Field>
        <Field>
          <Button className="font-sans" type="submit">
            Login
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center font-sans ">
            Belum memiliki akun?{" "}
            <a href="/auth/register" className="underline text-primary underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
