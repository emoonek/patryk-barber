import Link from "next/link";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { verifyEmailToken } from "@/modules/auth/auth.service";

export const metadata = {
  title: "Weryfikacja emaila",
};

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let message = "Email został potwierdzony. Możesz korzystać z konta.";
  let ok = true;

  try {
    await verifyEmailToken(token);
  } catch (error) {
    ok = false;
    message = error instanceof Error ? error.message : "Nie udało się potwierdzić emaila.";
  }

  return (
    <AuthShell
      eyebrow="Weryfikacja"
      title={ok ? "Email potwierdzony" : "Nie udało się potwierdzić emaila"}
      description={message}
    >
      <div className="mt-8">
        <Link
          className="inline-flex bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
          href="/konto"
        >
          Przejdź do konta
        </Link>
      </div>
    </AuthShell>
  );
}
