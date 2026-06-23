import { AuthShell } from "@/modules/auth/components/auth-shell";

export const metadata = {
  title: "Logowanie",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Konto klienta"
      title="Logowanie"
      description="To jest placeholder formularza. Pełna obsługa sesji i logowania pojawi się w następnym etapie."
    />
  );
}
