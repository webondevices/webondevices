"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./HeroCarousel.module.css";

export type HeroSlide = {
  image: string;
  /** Names the slide's dot, e.g. "Software Engineering". */
  title: string;
};

const INTERVAL_MS = 6000;

/** The hero artwork: one photo per discipline, cross-fading, with dots to pick one. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, slides.length]);

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.image}
          src={slide.image}
          alt=""
          fill
          sizes="100vw"
          priority={index === 0}
          className={styles.image}
          data-active={index === active}
        />
      ))}

      <div className={styles.dots} role="group" aria-label="Hero images">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            className={styles.dot}
            aria-label={`Show ${slide.title}`}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}
