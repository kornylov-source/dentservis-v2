"use client";

import Script from "next/script";

/**
 * Binotel GetCall — віджет зворотного дзвінка (callback «передзвонимо за 30 секунд»).
 * Офіційний сниппет — самодостатній IIFE, який вантажить
 * //my.binotel.ua/getcall/widgets/<widgetId>.js.
 *
 * widgetId генерується індивідуально в кабінеті Binotel і кладеться в
 * NEXT_PUBLIC_BINOTEL_WIDGET_ID. Поки змінної немає — НЕ рендеримо нічого
 * (жодного порожнього/битого віджета на проді).
 *
 * УВАГА: NEXT_PUBLIC_* запікається на build-time. Після додавання змінної
 * у Vercel env потрібен redeploy, інакше вона не підхопиться.
 *
 * strategy="lazyOnload": віджет не критичний для першого рендера, вантажиться
 * в браузерний idle після основних ресурсів (рекомендація next/script для
 * floating chat/social-віджетів).
 */
export default function BinotelGetCall() {
  const widgetId = process.env.NEXT_PUBLIC_BINOTEL_WIDGET_ID;

  // Рендеримо тільки якщо env задана і це валідний числовий ID Binotel.
  // Whitelist ^\d+$ захищає від injection у JS-рядок і від сміття в env.
  if (!widgetId || !/^\d+$/.test(widgetId)) {
    return null;
  }

  return (
    <Script id="binotel-getcall" strategy="lazyOnload">
      {`(function(d, w, s) {
    var widgetId = '${widgetId}', gcw = d.createElement(s); gcw.type = 'text/javascript'; gcw.async = true;
    gcw.src = '//my.binotel.ua/getcall/widgets/'+ widgetId +'.js';
    var sn = d.getElementsByTagName(s)[0]; sn.parentNode.insertBefore(gcw, sn);
})(document, window, 'script');`}
    </Script>
  );
}
