import { AuthShell } from "@/modules/auth/components/auth-shell";
import { RegisterForm } from "@/modules/auth/components/register-form";

export const metadata = {
  title: "Rejestracja",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Nowe konto"
      title="Rejestracja"
      description="Utwórz konto klienta. Link do weryfikacji emaila wyślemy na podany adres."
    >
      <RegisterForm />
    </AuthShell>
  );
}
