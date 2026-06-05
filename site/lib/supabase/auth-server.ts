import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Серверний Supabase-клієнт для Auth (читання/оновлення сесії з cookies).
 * Anon ключ — це лише для перевірки сесії юзера, не для доступу до даних
 * (контент читається service-клієнтом). Для server components / route handlers.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Викликано з Server Component — ігноруємо (сесію оновлюють route handlers).
          }
        },
      },
    },
  );
}
