import Link from "next/link";
import { CinematicVideoHero } from "@/components/marketing/cinematic-video-hero";
import { ScrollScrubVideo } from "@/components/marketing/scroll-scrub-video";
import { BUSINESS_PROFILE } from "@/domain/types";
import { formatMoney } from "@/modules/booking/booking.format";
import { listActiveServices } from "@/modules/booking/booking.repository";
import { listVisibleGalleryImages } from "@/modules/gallery/gallery.repository";

const heroVideoSrc = "/video/hero-first-cut.mp4";

const fallbackGallery = [
  {
    id: "fallback-1",
    imageUrl: "/galeria-testowa/fade-broda.png",
    altText: "Fade i broda - testowy kadr portfolio",
    title: "Fade / beard control",
  },
  {
    id: "fallback-2",
    imageUrl: "/galeria-testowa/przedipo-metamorfoza.png",
    altText: "Metamorfoza fryzury - testowy kadr portfolio",
    title: "Transformation study",
  },
  {
    id: "fallback-3",
    imageUrl: "/galeria-testowa/slickback-broda.png",
    altText: "Slick back z broda - testowy kadr portfolio",
    title: "Classic shape",
  },
  {
    id: "fallback-4",
    imageUrl: "/galeria-testowa/barberprzypracy.png",
    altText: "Barber przy pracy - testowy kadr portfolio",
    title: "Process frame",
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
          <div className="metallic-divider w-full" />
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
            <div className="technical-border bg-black/48 p-4 backdrop-blur-sm md:p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-barber-silver">Nowy kierunek</p>
              <p className="mt-4 text-2xl font-semibold leading-tight text-barber-frost">
                Surowa forma, zimny połysk i tempo kampanii marki.
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

      <section className="cinematic-section grid bg-[#06080a] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[56svh] lg:min-h-[170svh]">
          <ScrollScrubVideo
            className="sticky top-0 h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(185,216,238,0.16),transparent_28rem),#050607]"
            poster={heroFallback}
            src={heroVideoSrc}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,5,0.25),rgba(3,4,5,0.88))]" />
        </div>
        <div className="relative z-10 flex min-h-[72svh] items-center px-5 py-16 md:min-h-[100svh] md:px-10 md:py-20">
          <div className="mx-auto max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-barber-silver">Transformacja / craft</p>
            <h2 className="mt-5 text-[clamp(2.25rem,7vw,6.8rem)] font-black uppercase leading-[0.9] text-barber-frost md:mt-6">
              Fade budowany warstwa po warstwie.
            </h2>
            <div className="mt-8 grid gap-5 text-lg font-semibold leading-tight text-barber-chrome md:mt-10 md:gap-7 md:text-2xl">
              <p>Detal, który zmienia całą sylwetkę.</p>
              <p>Strzyżenie jako forma, nie tylko skracanie włosów.</p>
              <p className="text-barber-silver">Szybkość bez utraty kontroli nad linią, ciężarem i proporcją.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver md:tracking-[0.34em]">Usługi / active database</p>
              <h2 className="mt-5 text-[clamp(2.45rem,8vw,8rem)] font-black uppercase leading-[0.86] text-barber-frost md:leading-[0.82]">
                Cennik jak plakat.
              </h2>
            </div>
            <Link className="chrome-button w-fit px-5 py-3 text-sm font-black uppercase" href="/rezerwacja">
              Rezerwuj termin
            </Link>
          </div>

          <div className="mt-10 border-y border-barber-chrome/20 md:mt-12">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  className="grid gap-3 border-b border-barber-steel/30 py-6 last:border-b-0 md:grid-cols-[1fr_auto] md:items-end"
                  key={service.id}
                >
                  <div>
                    <h3 className="text-[clamp(1.8rem,5vw,5.6rem)] font-black uppercase leading-[0.95] text-barber-frost md:leading-[0.9]">
                      {service.name}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm uppercase tracking-[0.16em] text-barber-silver">
                      {service.description ?? `${service.durationMinutes} min / precision service`}
                    </p>
                  </div>
                  <p className="text-left text-[clamp(1.45rem,4vw,4rem)] font-black text-barber-chrome md:text-right">
                    {formatMoney(service.priceCents)}
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
              <h2 className="mt-5 text-[clamp(2.35rem,8vw,7.8rem)] font-black uppercase leading-[0.88] text-barber-frost md:leading-[0.85]">
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
                    className="h-full w-full object-cover saturate-0 transition duration-500 group-hover:scale-[1.03] group-hover:saturate-[0.35]"
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

      <section className="grid min-h-[72svh] items-center px-5 py-16 md:min-h-[88svh] md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-barber-silver">O Patryku</p>
            <h2 className="mt-5 text-[clamp(2.8rem,9vw,9.5rem)] font-black uppercase leading-[0.84] text-barber-frost md:leading-[0.82]">
              PAT BARBER.
            </h2>
            <p className="mt-7 max-w-3xl text-[clamp(1.15rem,3vw,2.8rem)] font-semibold leading-tight text-barber-chrome md:mt-8">
              Barber since &apos;25. Szkolony u Artura Głażewskiego i doskonalony pod okiem Kacpra Trzaskowskiego.
            </p>
          </div>
          <div className="technical-border bg-white/[0.03] p-6">
            <p className="text-2xl font-black uppercase leading-tight text-barber-frost">
              Precyzja fade, metamorfozy, szybkość bez utraty jakości.
            </p>
            <div className="mt-8 grid gap-3 text-sm uppercase tracking-[0.18em] text-barber-silver">
              <p>{BUSINESS_PROFILE.address}</p>
              <p>{BUSINESS_PROFILE.phone}</p>
              <p>{BUSINESS_PROFILE.instagram}</p>
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
