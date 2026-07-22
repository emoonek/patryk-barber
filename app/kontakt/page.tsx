import Link from "next/link";
import { BUSINESS_PROFILE } from "@/domain/types";

export const metadata = {
  title: "Kontakt",
};

const contactItems = [
  { label: "Adres", value: BUSINESS_PROFILE.address },
  { label: "Telefon", value: BUSINESS_PROFILE.phone },
  { label: "Email", value: BUSINESS_PROFILE.email },
  { label: "Instagram", value: BUSINESS_PROFILE.instagram, href: BUSINESS_PROFILE.instagramUrl, linkText: "Instagram" },
  { label: "Facebook", value: BUSINESS_PROFILE.facebook, href: BUSINESS_PROFILE.facebookUrl, linkText: "Facebook" },
  { label: "Mapa", value: BUSINESS_PROFILE.address, href: BUSINESS_PROFILE.googleMapsUrl, linkText: "Pokaż w Google Maps" },
];

export default function ContactPage() {
  return (
    <section className="chrome-page-shell relative overflow-hidden px-5 py-14 md:px-10 md:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(217,226,234,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(217,226,234,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="mx-auto max-w-6xl">
        <div className="metallic-divider" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver md:tracking-[0.34em]">
              Kontakt / Piecki
            </p>
            <h1 className="mt-5 text-[clamp(2.45rem,7vw,6rem)] font-black uppercase leading-[0.9] text-barber-frost">
              Pat Barber.
            </h1>
          </div>
          <div className="frosted-panel p-5">
            <p className="text-lg font-semibold leading-tight text-barber-chrome md:text-2xl">
              Pytanie o wizytę, termin albo usługę? Najszybciej złapiesz salon telefonicznie albo przez social media.
            </p>
            <Link className="chrome-button mt-6 px-5 py-3 text-sm font-black uppercase" href="/rezerwacja">
              Zarezerwuj termin
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {contactItems.map((item) => (
            <div className="frosted-panel p-5" key={item.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-barber-silver">{item.label}</p>
              <p className="mt-3 text-xl font-semibold leading-tight text-barber-frost">{item.value}</p>
              {item.href ? (
                <a
                  className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.18em] text-barber-chrome"
                  href={item.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.linkText}
                </a>
              ) : null}
            </div>
          ))}
          <div className="frosted-panel p-5 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-barber-silver">Godziny</p>
            <div className="mt-3 grid gap-2 text-xl font-semibold leading-tight text-barber-frost">
              {BUSINESS_PROFILE.openingHours.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
