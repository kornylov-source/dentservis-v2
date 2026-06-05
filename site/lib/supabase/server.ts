import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Серверний Supabase-клієнт із service_role ключем (обходить RLS).
 * ТІЛЬКИ для server components / route handlers / server actions.
 * service_role ключ ніколи не потрапляє в браузер (не NEXT_PUBLIC_, + server-only).
 */
let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables",
    );
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
