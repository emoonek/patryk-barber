"use client";

import { useEffect, useState } from "react";

type CinematicVideoHeroProps = {
  fallbackImage?: string;
  src: string;
};

export function CinematicVideoHero({ fallbackImage, src }: CinematicVideoHeroProps) {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPlayVideo(!reducedMotionQuery.matches);
    };

    updatePreference();
    reducedMotionQuery.addEventListener("change", updatePreference);

    return () => {
      reducedMotionQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(185,216,238,0.22),transparent_34rem),linear-gradient(135deg,#030405,#111820_56%,#050607)]">
      {fallbackImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.42] saturate-[0.35]"
          src={fallbackImage}
        />
      ) : null}
      {playVideo ? (
        /* Placeholder Pika video. Replace with Patryk's dedicated hero film when delivered. */
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover opacity-[0.82] saturate-[0.42] contrast-[1.08]"
          loop
          muted
          playsInline
          poster={fallbackImage}
          preload="metadata"
          src={src}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(185,216,238,0.18),transparent_24rem),linear-gradient(90deg,rgba(3,4,5,0.88),rgba(3,4,5,0.38)_48%,rgba(3,4,5,0.72)),linear-gradient(0deg,rgba(3,4,5,0.94),rgba(3,4,5,0.12)_48%,rgba(3,4,5,0.38))]" />
    </div>
  );
}
