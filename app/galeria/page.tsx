import Link from "next/link";
import { listVisibleGalleryImages } from "@/modules/gallery/gallery.repository";

export const metadata = {
  title: "Galeria",
};

export default async function GalleryPage() {
  const images = await listVisibleGalleryImages();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Portfolio</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Galeria prac</h1>
          <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
            Wybrane fryzury, brody i kadry z pracy w salonie. Zdjecia testowe sa tymczasowe i zostana
            pozniej zastapione prawdziwym portfolio Patryka.
          </p>
        </div>
        <Link
          className="border border-barber-brass bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
          href="/rezerwacja"
        >
          Zarezerwuj termin
        </Link>
      </div>

      {images.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <figure className="overflow-hidden border border-white/10 bg-black/20" key={image.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={image.altText}
                className="aspect-[4/5] w-full bg-black/30 object-cover"
                src={image.imageUrl}
              />
              <figcaption className="grid gap-2 p-4">
                <p className="font-medium text-barber-cream">{image.altText}</p>
                {image.title ? <p className="text-sm leading-6 text-barber-muted">{image.title}</p> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
          Galeria jest jeszcze pusta. Wroc tu wkrotce.
        </p>
      )}
    </section>
  );
}
