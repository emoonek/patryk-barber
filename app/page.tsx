import Link from "next/link";
import { BUSINESS_PROFILE } from "@/domain/types";

export default function HomePage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl content-center gap-10 px-6 py-16">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-[0.28em] text-barber-brass">
          Premium barber shop
        </p>
        <h1 className="text-5xl font-semibold leading-tight text-barber-cream md:text-7xl">
          Patryk Barber
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-barber-muted">
          Fundament aplikacji jest gotowy pod publiczną stronę, konta klientów i panel admina.
          Podstawowy booking engine pozwala wybrać usługę, termin i zarządzać wizytami w koncie.
        </p>
      </div>

      <div className="grid gap-4 text-sm text-barber-muted md:grid-cols-3">
        <div className="border-l border-barber-brass/60 pl-4">
          <p className="font-medium text-barber-cream">Adres</p>
          <p>{BUSINESS_PROFILE.address}</p>
        </div>
        <div className="border-l border-barber-brass/60 pl-4">
          <p className="font-medium text-barber-cream">Kontakt</p>
          <p>{BUSINESS_PROFILE.phone}</p>
          <p>{BUSINESS_PROFILE.email}</p>
        </div>
        <div className="border-l border-barber-brass/60 pl-4">
          <p className="font-medium text-barber-cream">Social media</p>
          <p>Instagram: {BUSINESS_PROFILE.instagram}</p>
          <p>Facebook: {BUSINESS_PROFILE.facebook}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          className="border border-barber-brass bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
          href="/rezerwacja"
        >
          Zarezerwuj termin
        </Link>
        <Link
          className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
          href="/logowanie"
        >
          Zaloguj się
        </Link>
      </div>
    </section>
  );
}
