export const metadata = {
  title: "Konto",
};

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Strefa klienta</p>
      <h1 className="text-4xl font-semibold text-barber-cream">Konto klienta</h1>
      <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
        Placeholder chronionej strony klienta. W kolejnych etapach pojawią się dane profilu,
        historia rezerwacji i możliwość anulowania wizyty.
      </p>
    </section>
  );
}
