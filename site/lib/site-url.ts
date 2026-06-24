/**
 * Канонічний публічний URL сайту. Єдине джерело правди для sitemap,
 * robots, canonical, og:url, JSON-LD. Можна перекрити через env на превʼю.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://dentservice.dp.ua";
