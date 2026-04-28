"use client";

import { useEffect } from "react";

// Перезапуск Webflow Interactions после React-гидратации.
// Webflow.js загружается afterInteractive, но мы рендерим секции с data-w-id
// через dangerouslySetInnerHTML — эти элементы попадают в DOM ПОСЛЕ того,
// как Webflow проинициализировался. Без перезапуска ix2 анимации не сработают.

interface WebflowGlobal {
  ready?: () => void;
  destroy?: () => void;
  require?: (name: string) => { init?: () => void } | undefined;
}

declare global {
  interface Window {
    Webflow?: WebflowGlobal;
  }
}

export default function WebflowInit() {
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;

    // Финальный fallback: если ix2 не отработал — показываем элементы
    // и сбрасываем transform-translate (стартовое состояние Webflow-анимаций),
    // чтобы текст не застревал "сдвинутым вниз на 100px".
    const forceVisible = () => {
      document.querySelectorAll<HTMLElement>('[data-w-id]').forEach((el) => {
        const t = el.style.transform;
        // Сбрасываем только translate-сдвиги, scale/rotate оставляем
        if (t && /translate3d\(\s*0(?:px)?\s*,\s*(?!0)/.test(t)) {
          el.style.transform = "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)";
        }
        if (el.style.opacity === "0") {
          el.style.opacity = "1";
        }
      });
    };

    const tryInit = () => {
      attempts += 1;
      const wf = (typeof window !== "undefined" ? window.Webflow : undefined) as
        | WebflowGlobal
        | undefined;

      if (!wf) {
        if (attempts < maxAttempts) {
          setTimeout(tryInit, 200);
        } else {
          forceVisible();
        }
        return;
      }

      try {
        wf.destroy?.();
        wf.ready?.();
        const ix2 = wf.require?.("ix2");
        ix2?.init?.();

        // Триггерим scroll/resize, чтобы IntersectionObserver Webflow заметил
        // элементы во вьюпорте и запустил их анимации без участия пользователя.
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event("scroll"));
          window.dispatchEvent(new Event("resize"));
        });

        // Подстраховка: через 2с проверяем, не остались ли элементы в стартовом
        // состоянии (transform translate с ненулевым Y). Если да — форсим reveal.
        setTimeout(forceVisible, 2000);
      } catch (e) {
        console.warn("Webflow re-init failed:", e);
        forceVisible();
      }
    };

    const timer = setTimeout(tryInit, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
