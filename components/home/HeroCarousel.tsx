"use client";

import { useEffect, useState } from "react";
import type { BannerRecord } from "@/lib/api";
import Hero from "./Hero";

export default function HeroCarousel({ banners }: { banners: BannerRecord[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (banners.length < 2 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(id);
  }, [banners.length, paused]);

  if (banners.length === 0) {
    return <Hero />;
  }

  function goTo(i: number) {
    setIndex((i + banners.length) % banners.length);
  }

  return (
    <div className="bg-[var(--blue)] pt-24 sm:pt-28">
      <section
        className="relative aspect-[16/5] w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {banners.map((banner, i) => {
          const image = (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={banner.imageUrl} alt={banner.alt} className="h-full w-full object-cover" />
          );

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {banner.link ? (
                <a href={banner.link} className="block h-full w-full">
                  {image}
                </a>
              ) : (
                image
              )}
            </div>
          );
        })}

        {banners.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:left-6 sm:h-11 sm:w-11"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 sm:h-5 sm:w-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Próximo banner"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-6 sm:h-11 sm:w-11"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 sm:h-5 sm:w-5">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5 sm:bottom-5 sm:gap-2">
              {banners.map((banner, i) => (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={`Ir para o banner ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all sm:h-2.5 ${
                    i === index ? "w-5 bg-[var(--red)] sm:w-7" : "w-1.5 bg-white/40 hover:bg-white/70 sm:w-2.5"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
