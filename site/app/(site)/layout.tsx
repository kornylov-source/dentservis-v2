import type { Metadata } from "next";
import Script from "next/script";

import BinotelGetCall from "@/components/BinotelGetCall";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Дентсервіс — медичний центр у Дніпрі",
  description:
    "Сучасний медичний центр з цифровим протоколом лікування. Імплантація, ортопедія, пародонтологія, естетична стоматологія. 30+ років практики медичного директора у Дніпрі.",
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/webclip.png",
  },
  verification: {
    google: "o7He5n-gFNW6omFECAKX79aLdFfEIxiNcaIpg2yBbVw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      data-wf-page="69ef4f99d8f9aaa14b958719"
      data-wf-site="69ef4f97d8f9aaa14b9585ea"
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="generator" content="Dent-Servis" />

        {/* Webflow CSS — порядок критичен: normalize → webflow → site → custom */}
        <link rel="stylesheet" href="/css/normalize.css" />
        <link rel="stylesheet" href="/css/webflow.css" />
        <link rel="stylesheet" href="/css/dent-servis-site.webflow.css" />
        <link rel="stylesheet" href="/css/dent-servis-custom.css" />

        {/* Plus Jakarta Sans через Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* WebFont.load — как в шаблоне Flossy для совместимости с Webflow CSS */}
        <Script
          src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
          strategy="beforeInteractive"
        />
        <Script id="webfont-init" strategy="beforeInteractive">
          {`WebFont.load({google:{families:["Plus Jakarta Sans:300,400,500,600,700"]}});`}
        </Script>

        {/* w-mod-js init — критично, ставит класс w-mod-js на html */}
        <Script id="webflow-mod-init" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
        </Script>
      </head>
      <body>
        {children}

        {/* AI-помічник: floating chat widget. Client component, грузиться lazy. */}
        <ChatWidget />

        {/* Binotel GetCall — віджет зворотного дзвінка. Рендериться тільки якщо
            задано NEXT_PUBLIC_BINOTEL_WIDGET_ID (lazyOnload). */}
        <BinotelGetCall />

        {/* jQuery — обязательная зависимость webflow.js (загружаем ПЕРЕД ним) */}
        <Script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js"
          strategy="afterInteractive"
        />
        {/* webflow.js — движок анимаций и слайдеров */}
        <Script src="/js/webflow.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
