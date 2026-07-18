import { AuthShell } from "@/modules/auth/components/auth-shell";
import { ForgotPasswordForm } from "@/modules/auth/components/forgot-password-form";

export const metadata = {
  title: "Reset hasła",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Reset hasła"
      title="Nie pamiętasz hasła?"
      description="Podaj email konta. Jeśli konto istnieje, wyślemy link resetu hasła."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
