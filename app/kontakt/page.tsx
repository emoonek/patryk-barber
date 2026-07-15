import Link from "next/link";
import { BUSINESS_PROFILE } from "@/domain/types";

export const metadata = {
  title: "Kontakt",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Kontakt</p>
      <h1 className="text-4xl font-semibold text-barber-cream">Patryk Barber</h1>
      <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
        Masz pytanie o wizytę, termin albo usługę? Skontaktuj się bezpośrednio z salonem.
      </p>

      <div className="mt-10 grid gap-5 text-sm text-barber-muted md:grid-cols-2">
        <div className="border border-white/10 bg-black/20 p-6">
          <p className="font-medium text-barber-cream">Adres</p>
          <p className="mt-2 leading-6">{BUSINESS_PROFILE.address}</p>
        </div>
        <div className="border border-white/10 bg-black/20 p-6">
          <p className="font-medium text-barber-cream">Telefon</p>
          <p className="mt-2 leading-6">{BUSINESS_PROFILE.phone}</p>
        </div>
        <div className="border border-white/10 bg-black/20 p-6">
          <p className="font-medium text-barber-cream">Email</p>
          <p className="mt-2 leading-6">{BUSINESS_PROFILE.email}</p>
        </div>
        <div className="border border-white/10 bg-black/20 p-6">
          <p className="font-medium text-barber-cream">Social media</p>
          <p className="mt-2 leading-6">Instagram: {BUSINESS_PROFILE.instagram}</p>
          <p>Facebook: {BUSINESS_PROFILE.facebook}</p>
        </div>
      </div>

      <Link
        className="mt-8 inline-flex border border-barber-brass bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
        href="/rezerwacja"
      >
        Zarezerwuj termin
      </Link>
    </section>
  );
}
