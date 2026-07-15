import { BUSINESS_PROFILE } from "@/domain/types";

export const metadata = {
  title: "Polityka prywatności",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Prywatność</p>
      <h1 className="text-4xl font-semibold text-barber-cream">Polityka prywatności</h1>
      <p className="mt-5 rounded-none border border-barber-brass/40 bg-black/20 p-5 text-sm leading-6 text-barber-muted">
        To prosta wersja polityki prywatności na potrzeby MVP. Przed wdrożeniem produkcyjnym finalna treść
        powinna zostać zweryfikowana przez właściciela salonu i, jeśli to potrzebne, przez prawnika.
      </p>

      <div className="mt-10 grid gap-8 text-barber-muted">
        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">1. Administrator danych</h2>
          <div className="leading-7">
            <p>Administratorem danych w ramach MVP jest {BUSINESS_PROFILE.name}.</p>
            <p>Adres: {BUSINESS_PROFILE.address}</p>
            <p>Email kontaktowy: {BUSINESS_PROFILE.email}</p>
            <p>Telefon: {BUSINESS_PROFILE.phone}</p>
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">2. Jakie dane zbieramy</h2>
          <p className="leading-7">
            W aplikacji przetwarzamy dane podane przy rejestracji i korzystaniu z rezerwacji: imię, nazwisko,
            adres email, opcjonalny numer telefonu oraz historię rezerwacji i ich statusów.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">3. Cel przetwarzania</h2>
          <p className="leading-7">
            Dane są wykorzystywane do obsługi konta klienta, tworzenia i zarządzania rezerwacjami, kontaktu
            w sprawie wizyt oraz podstawowej obsługi salonu.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">4. Maile transakcyjne</h2>
          <p className="leading-7">
            Aplikacja może wysyłać maile transakcyjne, w tym link do weryfikacji adresu email, link resetu hasła,
            potwierdzenie rezerwacji, informację o anulowaniu wizyty oraz wiadomości od admina związane z wizytą.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-2xl font-semibold text-barber-cream">5. Płatności</h2>
          <p className="leading-7">
            MVP nie obsługuje płatności online i nie przetwarza danych kart płatniczych. Płatność odbywa się
            na miejscu w salonie.
          </p>
        </section>
      </div>
    </section>
  );
}
