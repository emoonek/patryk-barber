import { BUSINESS_PROFILE } from "@/domain/types";

export const metadata = {
  title: "Regulamin rezerwacji",
};

export default function BookingTermsPage() {
  return (
    <section className="chrome-page-shell px-5 py-14 md:px-10 md:py-24">
      <article className="document-panel mx-auto max-w-4xl p-5 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver">Regulamin</p>
        <h1 className="mt-4 text-[clamp(2rem,5.4vw,3.4rem)] font-black uppercase leading-[0.95] text-barber-frost">
          Regulamin rezerwacji
        </h1>
        <p className="mt-6 border-l border-barber-chrome/30 pl-4 text-sm leading-6 text-barber-silver">
          Zasady korzystania z rezerwacji online w Patryk Barber. Rezerwuj termin wygodnie przez konto klienta,
          a w razie pytań skontaktuj się bezpośrednio z salonem.
        </p>

        <div className="mt-10 grid gap-8 text-barber-silver">
          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">1. Rezerwacje online</h2>
            <p className="leading-7">
              Rezerwacja wizyty online wymaga założenia konta klienta oraz potwierdzenia adresu email. Klient może
              posiadać maksymalnie 3 aktywne przyszłe rezerwacje jednocześnie.
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">2. Płatność</h2>
            <p className="leading-7">
              Aplikacja nie pobiera płatności online. Płatność za usługę odbywa się na miejscu w salonie, zgodnie
              z aktualnym cennikiem.
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">3. Anulowanie i zmiana terminu</h2>
            <p className="leading-7">
              Klient może anulować przyszłą wizytę z poziomu swojego konta. Admin lub barber może anulować wizytę
              albo skontaktować się z klientem w sprawie zmiany terminu, jeśli wymaga tego organizacja pracy salonu.
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">4. Nadużycia</h2>
            <p className="leading-7">
              Nadużycia, w tym wielokrotne rezerwowanie terminów bez zamiaru skorzystania z usługi, mogą skutkować
              blokadą konta i brakiem możliwości tworzenia nowych rezerwacji online.
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">5. Kontakt do salonu</h2>
            <div className="leading-7">
              <p>{BUSINESS_PROFILE.name}</p>
              <p>{BUSINESS_PROFILE.address}</p>
              <p>Telefon: {BUSINESS_PROFILE.phone}</p>
              <p>Email: {BUSINESS_PROFILE.email}</p>
            </div>
          </section>
        </div>
      </article>
    </section>
  );
}
