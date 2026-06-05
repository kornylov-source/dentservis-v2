import { getServiceClient } from "@/lib/supabase/server";

/**
 * Keep-alive пінг для Supabase Free.
 * Безкоштовний план «засинає» після 7 днів без активності в БД. Vercel Cron
 * викликає цей роут раз на кілька днів → один легкий запит будить базу, тож
 * адмінка ніколи не гальмує після простою. Жодних зовнішніх залежностей.
 *
 * Захист: Vercel Cron додає заголовок Authorization: Bearer $CRON_SECRET.
 * Якщо CRON_SECRET заданий — перевіряємо його (щоб сторонні не дьоргали роут).
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  try {
    const sb = getServiceClient();
    // Найлегший можливий запит — рахуємо singleton-рядок контактів.
    const { error } = await sb
      .from("clinic_info")
      .select("id", { count: "exact", head: true });
    if (error) {
      console.error("[keep-alive] db error:", error.message);
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }
    return Response.json({ ok: true, pingedAt: new Date().toISOString() });
  } catch (e) {
    console.error("[keep-alive] exception:", e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
