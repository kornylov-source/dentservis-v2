/**
 * Сід послуг у таблицю services.
 * Запуск (з папки site):  node --env-file=.env.local supabase/seed-services.ts
 * Ідемпотентний (upsert by slug). Джерело — lib/services.ts.
 */
import { createClient } from "@supabase/supabase-js";
import { services } from "../lib/services.ts";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const rows = services.map((s, i) => {
  // slug і hidden — окремі колонки; решта йде в payload (published).
  const { slug, hidden, ...payload } = s;
  return {
    slug,
    status: "published",
    sort_order: i,
    hidden: Boolean(hidden),
    published: payload,
    draft: null,
  };
});

const { error } = await supabase
  .from("services")
  .upsert(rows, { onConflict: "slug" });
if (error) {
  console.error("SEED ERROR:", error);
  process.exit(1);
}

const { count } = await supabase
  .from("services")
  .select("*", { count: "exact", head: true });
console.log(`Seeded ${rows.length} services. Total rows: ${count}`);
