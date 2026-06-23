import { AuthShell } from "@/modules/auth/components/auth-shell";
import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

export const metadata = {
  title: "Nowe hasło",
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <AuthShell
      eyebrow="Nowe hasło"
      title="Ustaw nowe hasło"
      description="Wpisz nowe hasło dla konta powiązanego z linkiem resetu."
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
