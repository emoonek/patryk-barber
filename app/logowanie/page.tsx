import { AuthShell } from "@/modules/auth/components/auth-shell";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata = {
  title: "Logowanie",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Konto klienta"
      title="Logowanie"
      description="Zaloguj się adresem email i hasłem użytym podczas rejestracji."
    >
      <LoginForm />
    </AuthShell>
  );
}
