import { BUSINESS_PROFILE } from "@/domain/types";

export const metadata = {
  title: "Polityka prywatności",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="chrome-page-shell px-5 py-14 md:px-10 md:py-24">
      <article className="document-panel mx-auto max-w-4xl p-5 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver">Prywatność</p>
        <h1 className="mt-4 text-[clamp(2.25rem,7vw,4.6rem)] font-black uppercase leading-[0.9] text-barber-frost">
          Polityka prywatności
        </h1>
        <p className="mt-6 border-l border-barber-chrome/30 pl-4 text-sm leading-6 text-barber-silver">
          To prosta wersja polityki prywatności na potrzeby MVP. Przed wdrożeniem produkcyjnym finalna treść
          powinna zostać zweryfikowana przez właściciela salonu i, jeśli to potrzebne, przez prawnika.
        </p>

        <div className="mt-10 grid gap-8 text-barber-silver">
          <section className="grid gap-3">
            <h2 className="text-2xl font-semibold text-barber-frost">1. Administrator danych</h2>
            <div className="leading-7">
              <p>Administratorem danych w ramach MVP jest {BUSINESS_PROFILE.name}.</p>
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
              w sprawie wizyt oraz podstawowej obsługi salonu.
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
              MVP nie obsługuje płatności online i nie przetwarza danych kart płatniczych. Płatność odbywa się
              na miejscu w salonie.
            </p>
          </section>
        </div>
      </article>
    </section>
  );
}
