import { AuthShell } from "@/modules/auth/components/auth-shell";

export const metadata = {
  title: "Rejestracja",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Nowe konto"
      title="Rejestracja"
      description="Walidacje Zod są gotowe, ale zapis użytkownika i weryfikacja emaila nie są jeszcze podłączone."
    />
  );
}
