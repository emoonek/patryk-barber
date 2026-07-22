import Link from "next/link";
import { listVisibleGalleryImages } from "@/modules/gallery/gallery.repository";

export const metadata = {
  title: "Galeria",
};

export default async function GalleryPage() {
  const images = await listVisibleGalleryImages();

  return (
    <section className="chrome-page-shell px-5 py-14 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="metallic-divider" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver md:tracking-[0.34em]">
              Portfolio / public gallery
            </p>
            <h1 className="mt-5 text-[clamp(2.35rem,7vw,6.2rem)] font-black uppercase leading-[0.9] text-barber-frost">
              Galeria prac.
            </h1>
          </div>
          <div className="frosted-panel p-5">
            <p className="text-lg font-semibold leading-tight text-barber-chrome md:text-xl">
              Wybrane fryzury, brody i kadry z pracy w salonie. Zdjęcia testowe są tymczasowe i zostaną
              później zastąpione prawdziwym portfolio Patryka.
            </p>
            <Link className="chrome-button mt-6 inline-flex px-5 py-3 text-sm font-black uppercase" href="/rezerwacja">
              Zarezerwuj termin
            </Link>
          </div>
        </div>

        {images.length > 0 ? (
          <div className="mt-12 grid auto-rows-[230px] gap-4 sm:grid-cols-2 md:auto-rows-[280px] lg:auto-rows-[340px] lg:grid-cols-4">
            {images.map((image, index) => (
              <figure
                className={`group chrome-frame relative overflow-hidden bg-black ${
                  index % 7 === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                } ${index % 7 === 3 ? "lg:col-span-2" : ""}`}
                key={image.id}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={image.altText}
                  className="h-full w-full object-cover saturate-[0.78] transition duration-500 group-hover:scale-[1.025] group-hover:saturate-100"
                  src={image.imageUrl}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/72 to-transparent p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-barber-frost md:tracking-[0.18em]">
                    {image.title ?? image.altText}
                  </p>
                  <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-barber-silver md:text-xs md:tracking-[0.22em]">
                    Pat Barber / precision frame
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="document-panel mt-12 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver">Portfolio w przygotowaniu</p>
            <p className="mt-4 max-w-xl text-2xl font-semibold leading-tight text-barber-frost">
              Galeria jest jeszcze pusta. Wkrótce pojawią się tu wybrane prace Patryka.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
