"use client";

import { useEffect } from "react";

// Обработчик кнопок prev/next для секции отзывов.
// Делает плавный горизонтальный скролл по контейнеру .testimonials-track.
export default function TestimonialsScroll() {
  useEffect(() => {
    const track = document.querySelector<HTMLElement>(".testimonials-track");
    const prev = document.querySelector<HTMLElement>(
      ".testimonials-arrow-prev"
    );
    const next = document.querySelector<HTMLElement>(
      ".testimonials-arrow-next"
    );

    if (!track || !prev || !next) return;

    const getCardWidth = () => {
      const card = track.querySelector<HTMLElement>(
        ".testimonial-box-version-one"
      );
      if (!card) return 400;
      const styles = window.getComputedStyle(track);
      const gap = parseInt(styles.gap || "24", 10);
      return card.offsetWidth + gap;
    };

    const onPrev = () =>
      track.scrollBy({ left: -getCardWidth(), behavior: "smooth" });
    const onNext = () =>
      track.scrollBy({ left: getCardWidth(), behavior: "smooth" });

    prev.addEventListener("click", onPrev);
    next.addEventListener("click", onNext);

    return () => {
      prev.removeEventListener("click", onPrev);
      next.removeEventListener("click", onNext);
    };
  }, []);

  return null;
}
