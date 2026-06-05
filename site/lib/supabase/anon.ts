import { createBrowserClient } from "@supabase/ssr";

/** Браузерний Supabase-клієнт (anon/publishable ключ). Лише для Auth у клієнтських компонентах. */
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
