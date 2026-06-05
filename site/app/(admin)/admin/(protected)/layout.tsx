import { requireAdmin } from "@/lib/admin/auth";

/**
 * Гейт захищеної частини адмінки. requireAdmin() редіректить на /admin/login,
 * якщо немає валідної сесії або email не в allowlist. Сторінка /admin/login
 * лежить ПОЗА цією групою, тож не гейтиться (без циклу редіректів).
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <a href="/admin" className="font-semibold tracking-tight">
            Адмінка Дент-Сервіс
          </a>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="hidden sm:inline">{user.email}</span>
            <form action="/admin/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100"
              >
                Вийти
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
