import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

/**
 * Глобальна 404 для URL, що не збігаються з жодним роутом.
 * Потрібна окремо, бо з двома root-layout ((site)/(admin)) немає єдиного layout,
 * з якого Next зібрав би 404 (див. docs not-found.js → global-not-found).
 * Самодостатній HTML-документ із Webflow CSS — щоб 404 лишилась брендованою.
 * notFound() ВСЕРЕДИНІ (site) (битий slug) і далі бере (site)/not-found.tsx.
 */
export const metadata: Metadata = {
  title: "Сторінку не знайдено — Дентсервіс",
  description:
    "Сторінку не знайдено. Поверніться на головну Дентсервіс або відкрийте розділи послуг, лікарів і контактів.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="uk"
      data-wf-page="69ef4f99d8f9aaa14b958719"
      data-wf-site="69ef4f97d8f9aaa14b9585ea"
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Webflow CSS — порядок критичен: normalize → webflow → site → custom */}
        <link rel="stylesheet" href="/css/normalize.css" />
        <link rel="stylesheet" href="/css/webflow.css" />
        <link rel="stylesheet" href="/css/dent-servis-site.webflow.css" />
        <link rel="stylesheet" href="/css/dent-servis-custom.css" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `WebFont.load({google:{families:["Plus Jakarta Sans:300,400,500,600,700"]}});`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`,
          }}
        />
      </head>
      <body>
        <HtmlSection file="header.html" />
        <HtmlSection file="notfound-section.html" />
        <HtmlSection file="footer.html" />

        <WebflowInit />

        <script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js" />
        <script src="/js/webflow.js" />
      </body>
    </html>
  );
}
