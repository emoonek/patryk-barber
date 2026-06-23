export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Panel</p>
      <h1 className="text-4xl font-semibold text-barber-cream">Panel admina</h1>
      <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
        Placeholder panelu administracyjnego. Pełne zarządzanie rezerwacjami, klientami, usługami
        i dostępnością zostanie dodane po wdrożeniu auth oraz booking engine.
      </p>
    </section>
  );
}
