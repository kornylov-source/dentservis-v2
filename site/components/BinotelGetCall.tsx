"use client";

import Script from "next/script";

/**
 * Binotel GetCall — віджет зворотного дзвінка (callback «передзвонимо за 30 секунд»).
 * Binotel видає у кабінеті готовий <script async> з унікальним widgetId, який
 * вантажиться з widgets.binotel.com.
 *
 * widgetId за замовчуванням захардкоджений (бойовий ключ клініки). Можна
 * перекрити через NEXT_PUBLIC_BINOTEL_WIDGET_ID, не чіпаючи код.
 *
 * strategy="lazyOnload": віджет не критичний для першого рендера, вантажиться
 * в браузерний idle після основних ресурсів (рекомендація next/script для
 * floating chat/social-віджетів). НЕ конфліктує з AI-чатом — Binotel у
 * кабінеті виставлено в лівий нижній кут, чат — у правому.
 */
const DEFAULT_WIDGET_ID = "p33qm8q62xhr80ynm7ep";

export default function BinotelGetCall() {
  const widgetId =
    process.env.NEXT_PUBLIC_BINOTEL_WIDGET_ID || DEFAULT_WIDGET_ID;

  // Whitelist: лише латиниця/цифри (формат ID Binotel) — захист від сміття в env.
  if (!widgetId || !/^[a-z0-9]+$/i.test(widgetId)) {
    return null;
  }

  return (
    <Script
      id="binotel-getcall"
      src={`https://widgets.binotel.com/getcall/widgets/${widgetId}.js`}
      strategy="lazyOnload"
    />
  );
}
