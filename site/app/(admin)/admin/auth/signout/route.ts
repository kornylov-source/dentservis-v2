import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  // 303 → браузер робить GET на /admin/login після POST
  return NextResponse.redirect(`${origin}/admin/login`, { status: 303 });
}
