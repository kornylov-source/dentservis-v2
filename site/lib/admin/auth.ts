import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/auth-server";

/** Allowlist email-ів адмінів (env ADMIN_EMAILS, кома-розділені). */
function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Поточний адмін-юзер або null (сесія валідна + email у allowlist). */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  if (!allowedEmails().includes(user.email.toLowerCase())) return null;
  return user;
}

/** Авторитетний гейт: викликати на початку захищених layout-ів і КОЖНОГО server action. */
export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
