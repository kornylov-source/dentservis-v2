import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
