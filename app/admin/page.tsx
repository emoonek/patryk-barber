import { requireAdmin } from "@/modules/auth/auth.guards";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Panel</p>
      <h1 className="text-4xl font-semibold text-barber-cream">Panel admina</h1>
      <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
        Zalogowano jako administrator: {user.email}. Pełne zarządzanie rezerwacjami, klientami,
        usługami i dostępnością zostanie dodane po booking engine.
      </p>
    </section>
  );
}
