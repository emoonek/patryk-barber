"use client";

import { useEffect, useRef, useState } from "react";

type ScrollScrubVideoProps = {
  className?: string;
  poster?: string;
  src: string;
};

export function ScrollScrubVideo({ className = "", poster, src }: ScrollScrubVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const [canScrub, setCanScrub] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    const updateCapability = () => {
      setCanScrub(desktopQuery.matches && !reducedMotionQuery.matches);
    };

    updateCapability();
    reducedMotionQuery.addEventListener("change", updateCapability);
    desktopQuery.addEventListener("change", updateCapability);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateCapability);
      desktopQuery.removeEventListener("change", updateCapability);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container || !canScrub) {
      return;
    }

    let isVisible = false;

    const scrub = () => {
      frameRef.current = null;

      if (!isVisible || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      video.currentTime = Math.min(video.duration - 0.05, progress * video.duration);
    };

    const requestScrub = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(scrub);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          requestScrub();
        }
      },
      { threshold: 0.01 },
    );

    video.pause();
    observer.observe(container);
    window.addEventListener("scroll", requestScrub, { passive: true });
    window.addEventListener("resize", requestScrub);
    video.addEventListener("loadedmetadata", requestScrub);
    requestScrub();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestScrub);
      window.removeEventListener("resize", requestScrub);
      video.removeEventListener("loadedmetadata", requestScrub);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [canScrub]);

  return (
    <div className={className} ref={containerRef}>
      <video
        aria-hidden="true"
        className="h-full w-full object-cover"
        loop={!canScrub}
        muted
        playsInline
        poster={poster}
        preload="metadata"
        ref={videoRef}
        src={src}
      />
    </div>
  );
}
