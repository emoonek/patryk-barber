"use client";

import { useEffect, useState } from "react";

export type PortfolioSlideshowImage = {
  altText: string;
  id: string;
  imageUrl: string;
  title?: string | null;
};

type PortfolioSlideshowProps = {
  images: PortfolioSlideshowImage[];
  intervalMs?: number;
};

export function PortfolioSlideshow({ images, intervalMs = 4000 }: PortfolioSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const hasImages = images.length > 0;
  const activeImageIndex = hasImages ? Math.min(activeIndex, images.length - 1) : 0;
  const activeImage = hasImages ? images[activeImageIndex] : null;

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReduceMotion(reducedMotionQuery.matches);
    };

    updatePreference();
    reducedMotionQuery.addEventListener("change", updatePreference);

    return () => {
      reducedMotionQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    if (reduceMotion || images.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [images.length, intervalMs, reduceMotion]);

  if (!hasImages) {
    return (
      <div className="chrome-frame relative grid min-h-[360px] place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(185,216,238,0.14),transparent_20rem),#050607] p-6 sm:min-h-[460px] lg:min-h-[620px]">
        <div className="max-w-sm text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver">Portfolio w przygotowaniu</p>
          <p className="mt-4 text-2xl font-black uppercase leading-tight text-barber-frost">
            Zdjęcia pojawią się po uzupełnieniu galerii.
          </p>
        </div>
      </div>
    );
  }

  return (
    <figure className="chrome-frame relative aspect-[4/5] min-h-[360px] overflow-hidden bg-[#050607] sm:min-h-[480px] lg:aspect-[0.92] lg:min-h-[620px]">
      <div className="absolute inset-0">
        {images.map((image, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={image.altText}
            className={`absolute inset-0 h-full w-full object-cover saturate-[0.78] contrast-[1.06] transition duration-700 ease-out ${
              index === activeImageIndex ? "scale-100 opacity-100" : "scale-[1.018] opacity-0"
            }`}
            key={image.id}
            sizes="(min-width: 1024px) 52vw, 100vw"
            src={image.imageUrl}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(185,216,238,0.08),transparent_24rem),linear-gradient(90deg,rgba(3,4,5,0.08),rgba(3,4,5,0.28)),linear-gradient(0deg,rgba(3,4,5,0.78),rgba(3,4,5,0.08)_46%,rgba(3,4,5,0.24))]" />
      <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-barber-silver">Portfolio / frame</p>
            <p className="mt-2 max-w-xl text-xl font-black uppercase leading-tight text-barber-frost md:text-2xl">
              {activeImage?.title ?? activeImage?.altText}
            </p>
          </div>
          <div className="flex gap-2" aria-label="Postęp slideshow">
            {images.map((image, index) => (
              <span
                aria-hidden="true"
                className={`h-1 w-8 bg-barber-chrome transition-opacity duration-500 ${
                  index === activeImageIndex ? "opacity-95" : "opacity-28"
                }`}
                key={image.id}
              />
            ))}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
