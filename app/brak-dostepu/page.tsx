import Link from "next/link";

export const metadata = {
  title: "Brak dostępu",
};

export default function AccessDeniedPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Brak dostępu</p>
      <h1 className="text-4xl font-semibold text-barber-cream">Nie masz dostępu do tej sekcji</h1>
      <p className="mt-5 leading-7 text-barber-muted">
        Panel admina jest dostępny tylko dla kont z rolą administratora. Jeśli uważasz, że to błąd,
        skontaktuj się z osobą prowadzącą salon.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          className="border border-barber-brass bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
          href="/konto"
        >
          Wróć do konta
        </Link>
        <Link
          className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
          href="/"
        >
          Strona główna
        </Link>
      </div>
    </section>
  );
}
