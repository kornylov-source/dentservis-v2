import "./admin.css";
import type { Metadata } from "next";

/**
 * Окремий root-layout для адмінки. Свій <html>/<body>, лише Tailwind (admin.css) —
 * Webflow CSS публічного сайту сюди не вантажиться (перехід site↔admin = повне
 * перезавантаження сторінки, два CSS-світи ніколи не в одному документі).
 */
export const metadata: Metadata = {
  title: "Адмінка — Дент-Сервіс",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
