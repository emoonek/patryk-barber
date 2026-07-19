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
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(185,216,238,0.18),transparent_34rem),linear-gradient(135deg,#030405,#111418_56%,#050607)]">
      {fallbackImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.32] saturate-0"
          src={fallbackImage}
        />
      ) : null}
      {playVideo ? (
        /* TODO: replace the test campaign video with optimized MP4/WebM plus a dedicated poster frame. */
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover opacity-[0.68] saturate-0"
          loop
          muted
          playsInline
          poster={fallbackImage}
          preload="metadata"
          src={src}
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,5,0.94),rgba(3,4,5,0.58)_48%,rgba(3,4,5,0.86)),linear-gradient(0deg,rgba(3,4,5,0.96),rgba(3,4,5,0.18)_46%,rgba(3,4,5,0.52))]" />
    </div>
  );
}
