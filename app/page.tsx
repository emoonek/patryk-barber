import Link from "next/link";
import { CinematicVideoHero } from "@/components/marketing/cinematic-video-hero";
import { ScrollScrubVideo } from "@/components/marketing/scroll-scrub-video";
import { BUSINESS_PROFILE } from "@/domain/types";
import { formatMoney } from "@/modules/booking/booking.format";
import { listActiveServices } from "@/modules/booking/booking.repository";
import { listVisibleGalleryImages } from "@/modules/gallery/gallery.repository";

const heroVideoSrc = "/video/hero-first-cut.mp4";

function formatPosterMoney(priceCents: number) {
  return formatMoney(priceCents).replace(",00", "");
}

const fallbackGallery = [
  {
    id: "fallback-1",
    imageUrl: "/ig/Buzz Cut z Fade’em i Konturowaniem Brody.png",
    altText:
      "Krótkie, równo przycięte włosy połączone z płynnym cieniowaniem oraz precyzyjnie wyznaczoną linią włosów i brody.",
    title: "Buzz Cut z Fade’em i Konturowaniem Brody",
  },
  {
    id: "fallback-2",
    imageUrl: "/ig/Textured Crop z Hair Designem.png",
    altText: "Krótka, teksturowana góra, delikatne cieniowanie oraz indywidualny wzór wycięty nad uchem.",
    title: "Textured Crop z Hair Designem",
  },
  {
    id: "fallback-3",
    imageUrl: "/ig/French Crop z Mid Fade’em.png",
    altText: "Klasyczna krótka grzywka, równa tekstura na górze i płynne przejście po bokach.",
    title: "French Crop z Mid Fade’em",
  },
  {
    id: "fallback-4",
    imageUrl: "/ig/Klasyczne Strzyżenie z Side Partem.png",
    altText:
      "Elegancka fryzura zaczesana na bok, wykonana głównie nożyczkami i wykończona naturalnym cieniowaniem.",
    title: "Klasyczne Strzyżenie z Side Partem",
  },
];

export default async function HomePage() {
  const [services, galleryImages] = await Promise.all([listActiveServices(), listVisibleGalleryImages()]);
  const portfolioImages = (galleryImages.length > 0 ? galleryImages : fallbackGallery).slice(0, 4);
  const heroFallback = portfolioImages[0]?.imageUrl;

  return (
    <div className="bg-barber-black text-barber-frost">
      <section className="cinematic-section grain-overlay flex min-h-[calc(100svh-120px)] items-end px-5 pb-9 pt-16 sm:min-h-[calc(100svh-73px)] md:px-10 md:pb-14">
        <CinematicVideoHero fallbackImage={heroFallback} src={heroVideoSrc} />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10">
          <div className="metallic-divider w-full opacity-80" />
          <div className="grid gap-7 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-barber-silver md:text-xs md:tracking-[0.34em]">
                Piecki / cinematic cuts / ice precision
              </p>
              <h1 className="poster-type max-w-5xl font-black uppercase text-barber-frost">
                PAT <span className="ice-chrome-highlight">BARBER</span>
              </h1>
              <p className="mt-5 max-w-4xl text-[clamp(1.35rem,4vw,4.9rem)] font-black uppercase leading-[0.95] text-barber-frost md:mt-7">
                PRECYZJA. STYL. CHARAKTER.
              </p>
            </div>
            <div className="frosted-panel p-4 md:p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-barber-silver">Nowy kierunek</p>
              <p className="mt-4 text-2xl font-semibold leading-tight text-barber-frost">
                Precyzyjny cut, zimny połysk i tempo kampanii marki.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link className="chrome-button px-5 py-3 text-center text-sm font-black uppercase" href="/rezerwacja">
                  Umów wizytę
                </Link>
                <Link className="ghost-button px-5 py-3 text-center text-sm font-black uppercase" href="/galeria">
                  Zobacz portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_18%,rgba(185,216,238,0.12),transparent_30rem),linear-gradient(135deg,#05080a,#101821_52%,#050607)] px-5 py-14 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
        <div className="relative min-h-[54svh] overflow-hidden lg:min-h-[128svh]">
          <ScrollScrubVideo
            className="chrome-frame sticky top-24 h-[54svh] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(185,216,238,0.16),transparent_28rem),#050607] lg:h-[calc(100svh-7rem)]"
            poster={heroFallback}
            src={heroVideoSrc}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,5,0.08),rgba(3,4,5,0.34))]" />
        </div>
        <div className="relative z-10 flex items-center py-2 lg:min-h-[calc(100svh-8rem)] lg:py-12">
          <div className="frosted-panel max-w-xl p-5 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-barber-silver">Transformacja / craft</p>
            <h2 className="mt-5 text-[clamp(2.1rem,6vw,4.6rem)] font-black uppercase leading-[0.92] text-barber-frost md:mt-6">
              Fade budowany warstwa po warstwie.
            </h2>
            <div className="mt-8 grid gap-4 text-base font-semibold leading-tight text-barber-chrome md:text-xl">
              {[
                "Detal, który zmienia całą sylwetkę.",
                "Strzyżenie jako forma, nie tylko skracanie włosów.",
                "Szybkość bez utraty kontroli nad linią, ciężarem i proporcją.",
              ].map((item, index) => (
                <p className="border-l border-barber-chrome/28 pl-4" key={item}>
                  <span className="mr-3 text-xs uppercase tracking-[0.2em] text-barber-silver">0{index + 1}</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#050709,#0d1319_50%,#050709)] px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver md:tracking-[0.34em]">Usługi / active database</p>
              <h2 className="mt-5 text-[clamp(2.1rem,6vw,5.25rem)] font-black uppercase leading-[0.92] text-barber-frost">
                Cennik premium.
              </h2>
            </div>
            <Link className="chrome-button w-fit px-5 py-3 text-sm font-black uppercase" href="/rezerwacja">
              Rezerwuj termin
            </Link>
          </div>

          <div className="mt-10 overflow-hidden border-y border-barber-chrome/20 md:mt-12">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  className="group grid gap-3 border-b border-barber-steel/24 px-0 py-5 transition hover:bg-white/[0.035] md:grid-cols-[1fr_auto] md:items-center md:px-4 md:py-6"
                  key={service.id}
                >
                  <div>
                    <h3 className="max-w-4xl text-[clamp(1.45rem,3.4vw,3.7rem)] font-black uppercase leading-[1.02] text-barber-frost transition group-hover:text-barber-chrome">
                      {service.name}
                    </h3>
                    <p className="mt-2 max-w-2xl text-xs uppercase tracking-[0.16em] text-barber-silver md:text-sm">
                      {service.description ?? `${service.durationMinutes} min / precision service`}
                    </p>
                  </div>
                  <p className="text-left text-[clamp(1.35rem,3vw,2.65rem)] font-black text-barber-chrome md:text-right">
                    {formatPosterMoney(service.priceCents)}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-10 text-sm uppercase tracking-[0.18em] text-barber-silver">
                Aktywne usługi pojawią się po uzupełnieniu bazy.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#080b0e] px-5 py-16 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="metallic-divider" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-barber-silver">Portfolio</p>
              <h2 className="mt-5 text-[clamp(2.15rem,6vw,5.6rem)] font-black uppercase leading-[0.9] text-barber-frost">
                Kadry ostre jak stal.
              </h2>
              <Link className="mt-8 inline-flex ghost-button px-5 py-3 text-sm font-black uppercase" href="/galeria">
                Pełna galeria
              </Link>
            </div>
            <div className="grid auto-rows-[210px] gap-3 sm:grid-cols-2 md:auto-rows-[300px] md:gap-4">
              {portfolioImages.map((image, index) => (
                <figure
                  className={`group relative overflow-hidden border border-barber-chrome/20 bg-black ${
                    index === 0 ? "sm:row-span-2" : ""
                  } ${index === 2 ? "sm:translate-y-10" : ""}`}
                  key={image.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={image.altText}
                    className="h-full w-full object-cover saturate-[0.72] transition duration-500 group-hover:scale-[1.025] group-hover:saturate-100"
                    src={image.imageUrl}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-barber-silver">{image.title ?? image.altText}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid min-h-[64svh] items-center bg-[radial-gradient(circle_at_75%_20%,rgba(185,216,238,0.12),transparent_28rem)] px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-barber-silver">O Patryku</p>
            <h2 className="mt-5 text-[clamp(2.35rem,7vw,6.1rem)] font-black uppercase leading-[0.88] text-barber-frost">
              PAT BARBER.
            </h2>
            <p className="mt-7 max-w-3xl text-[clamp(1.08rem,2.4vw,2.1rem)] font-semibold leading-tight text-barber-chrome md:mt-8">
              Barber since &apos;25. Szkolony u Artura Głażewskiego i doskonalony pod okiem Kacpra Trzaskowskiego.
            </p>
          </div>
          <div className="frosted-panel p-6">
            <p className="text-xl font-black uppercase leading-tight text-barber-frost md:text-2xl">
              Precyzja fade, metamorfozy, szybkość bez utraty jakości.
            </p>
            <div className="mt-8 grid gap-3 text-sm uppercase tracking-[0.18em] text-barber-silver">
              <p>{BUSINESS_PROFILE.address}</p>
              <p>{BUSINESS_PROFILE.phone}</p>
              <p>{BUSINESS_PROFILE.instagram}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
                <a href={BUSINESS_PROFILE.instagramUrl} rel="noopener noreferrer" target="_blank">
                  Instagram
                </a>
                <a href={BUSINESS_PROFILE.facebookUrl} rel="noopener noreferrer" target="_blank">
                  Facebook
                </a>
                <a href={BUSINESS_PROFILE.googleMapsUrl} rel="noopener noreferrer" target="_blank">
                  Pokaż w Google Maps
                </a>
              </div>
              <div className="grid gap-1 pt-2">
                {BUSINESS_PROFILE.openingHours.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cinematic-section grain-overlay flex min-h-[74svh] items-center justify-center bg-[radial-gradient(circle_at_50%_15%,rgba(246,251,255,0.12),transparent_28rem),linear-gradient(180deg,#080b0e,#030405)] px-5 py-16 text-center md:min-h-[92svh] md:px-10 md:py-20">
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-[clamp(3.25rem,16vw,14rem)] font-black uppercase leading-[0.84] text-barber-frost md:leading-[0.82]">
            TWÓJ RUCH.
          </p>
          <p className="ice-chrome-highlight mt-4 text-[clamp(2.1rem,8vw,8rem)] font-black uppercase leading-[0.88] md:leading-[0.86]">
            UMÓW WIZYTĘ.
          </p>
          <Link className="chrome-button mt-10 inline-flex px-8 py-4 text-sm font-black uppercase" href="/rezerwacja">
            Przejdź do rezerwacji
          </Link>
        </div>
      </section>
    </div>
  );
}
