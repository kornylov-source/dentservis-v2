import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Глобальна 404 для невідповідних URL (потрібно при двох root-layout).
    globalNotFound: true,
    // Завантаження фото в адмінці йде через Server Action. Дефолтний ліміт тіла
    // (1 МБ) обрізав запит для фото > 1 МБ — кнопка вічно висіла на "Завантаження".
    // Файли валідуються до 5 МБ, тому 6 МБ дає запас на overhead форми.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  async redirects() {
    return [
      // www → apex (без www). Канонічний домен один — dentservice.dp.ua,
      // щоб Google не бачив два однакових сайти. 301 (permanent).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.dentservice.dp.ua" }],
        destination: "https://dentservice.dp.ua/:path*",
        permanent: true,
      },
      // Chrome иногда автодополняет URL до /uk (если в истории был такой URL).
      // Тоже самое поведение от языковых расширений / переводчика. Редиректим на главную.
      {
        source: "/uk",
        destination: "/",
        permanent: false,
      },
      {
        source: "/uk/:path*",
        destination: "/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
