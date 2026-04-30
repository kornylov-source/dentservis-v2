import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://dent-servis.com.ua/sitemap.xml",
    host: "https://dent-servis.com.ua",
  };
}
