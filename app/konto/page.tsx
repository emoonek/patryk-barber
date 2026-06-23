import { logoutAction } from "@/modules/auth/auth.actions";
import { requireAuth } from "@/modules/auth/auth.guards";

export const metadata = {
  title: "Konto",
};

export default async function AccountPage() {
  const user = await requireAuth();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Strefa klienta</p>
      <h1 className="text-4xl font-semibold text-barber-cream">Konto klienta</h1>
      <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
        Jesteś zalogowany jako {user.firstName} {user.lastName} ({user.email}).
      </p>
      <div className="mt-8 grid gap-3 border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
        <p>Rola: {user.role}</p>
        <p>
          Email:{" "}
          {user.emailVerifiedAt
            ? `zweryfikowany ${user.emailVerifiedAt.toLocaleDateString("pl-PL")}`
            : "oczekuje na weryfikację"}
        </p>
      </div>
      <form action={logoutAction} className="mt-6">
        <button className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass">
          Wyloguj się
        </button>
      </form>
    </section>
  );
}
