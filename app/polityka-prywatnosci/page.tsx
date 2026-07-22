import { BUSINESS_PROFILE } from "@/domain/types";

export const metadata = {
  title: "Polityka prywatności",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="chrome-page-shell px-5 py-14 md:px-10 md:py-24">
      <article className="document-panel mx-auto max-w-4xl p-5 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver">Prywatność</p>
        <h1 className="mt-4 text-[clamp(2rem,5.4vw,3.4rem)] font-black uppercase leading-[0.95] text-barber-frost">
          Polityka prywatności
        </h1>
        <p className="mt-6 border-l border-barber-chrome/30 pl-4 text-sm leading-6 text-barber-silver">
          Poniżej znajdziesz najważniejsze informacje o tym, jakie dane są przetwarzane podczas korzystania
          z konta klienta i rezerwacji online w Patryk Barber.
        </p>

        <div className="mt-10 grid gap-8 text-barber-silver">
          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">1. Administrator danych</h2>
            <div className="leading-7">
              <p>Administratorem danych jest {BUSINESS_PROFILE.name}.</p>
              <p>Adres: {BUSINESS_PROFILE.address}</p>
              <p>Email kontaktowy: {BUSINESS_PROFILE.email}</p>
              <p>Telefon: {BUSINESS_PROFILE.phone}</p>
            </div>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">2. Jakie dane zbieramy</h2>
            <p className="leading-7">
              W aplikacji przetwarzamy dane podane przy rejestracji i korzystaniu z rezerwacji: imię, nazwisko,
              adres email, opcjonalny numer telefonu oraz historię rezerwacji i ich statusów.
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">3. Cel przetwarzania</h2>
            <p className="leading-7">
              Dane są wykorzystywane do obsługi konta klienta, tworzenia i zarządzania rezerwacjami, kontaktu
              w sprawie wizyt, wysyłania wiadomości transakcyjnych oraz podstawowej obsługi salonu.
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">4. Maile transakcyjne</h2>
            <p className="leading-7">
              Aplikacja może wysyłać maile transakcyjne, w tym link do weryfikacji adresu email, link resetu hasła,
              potwierdzenie rezerwacji, informację o anulowaniu wizyty oraz wiadomości od admina związane z wizytą.
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">5. Płatności</h2>
            <p className="leading-7">
              Aplikacja nie obsługuje płatności online i nie przetwarza danych kart płatniczych. Płatność odbywa się
              na miejscu w salonie.
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">6. Zdjęcia galerii</h2>
            <p className="leading-7">
              Zdjęcia publikowane w galerii mogą być przechowywane i dostarczane z wykorzystaniem Cloudinary.
              Dane kont klientów i rezerwacji nie są wykorzystywane do obsługi płatności online.
            </p>
          </section>
        </div>
      </article>
    </section>
  );
}
