import { BUSINESS_PROFILE } from "@/domain/types";

export const metadata = {
  title: "Regulamin rezerwacji",
};

export default function BookingTermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Regulamin</p>
      <h1 className="text-4xl font-semibold text-barber-cream">Regulamin rezerwacji</h1>
      <p className="mt-5 rounded-none border border-barber-brass/40 bg-black/20 p-5 text-sm leading-6 text-barber-muted">
        To robocza wersja regulaminu na potrzeby MVP. Przed uruchomieniem produkcyjnym treść powinna zostać
        zweryfikowana przez właściciela salonu i, jeśli to potrzebne, przez prawnika.
      </p>

      <div className="mt-10 grid gap-8 text-barber-muted">
        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">1. Rezerwacje online</h2>
          <p className="leading-7">
            Rezerwacja wizyty online wymaga założenia konta klienta oraz potwierdzenia adresu email. Klient może
            posiadać maksymalnie 3 aktywne przyszłe rezerwacje jednocześnie.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">2. Płatność</h2>
          <p className="leading-7">
            Aplikacja nie pobiera płatności online. Płatność za usługę odbywa się na miejscu w salonie, zgodnie
            z aktualnym cennikiem i ustaleniami z barberem.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">3. Anulowanie i zmiana terminu</h2>
          <p className="leading-7">
            Klient może anulować przyszłą wizytę z poziomu swojego konta. Admin lub barber może anulować wizytę
            albo skontaktować się z klientem w sprawie zmiany terminu, jeśli wymaga tego organizacja pracy salonu.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">4. Nadużycia</h2>
          <p className="leading-7">
            Nadużycia, w tym wielokrotne rezerwowanie terminów bez zamiaru skorzystania z usługi, mogą skutkować
            blokadą konta i brakiem możliwości tworzenia nowych rezerwacji online.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">5. Kontakt do salonu</h2>
          <div className="leading-7">
            <p>{BUSINESS_PROFILE.name}</p>
            <p>{BUSINESS_PROFILE.address}</p>
            <p>Telefon: {BUSINESS_PROFILE.phone}</p>
            <p>Email: {BUSINESS_PROFILE.email}</p>
          </div>
        </section>
      </div>
    </section>
  );
}
