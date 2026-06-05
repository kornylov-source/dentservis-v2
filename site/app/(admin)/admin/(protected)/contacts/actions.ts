"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";
import { flattenZodError } from "@/lib/admin/schemas";
import { ClinicPayloadSchema } from "@/lib/admin/clinic-schema";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

// Контакти впливають на головну (футер не з БД), сторінку контактів, політику
// конфіденційності. AI-бот читає контакти на КОЖЕН запит — ревалідація йому не потрібна.
function revalidateContactPages() {
  revalidatePath("/kontakty");
  revalidatePath("/polityka-konfidentsiynosti");
  revalidatePath("/");
}

export async function saveClinicDraft(payload: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = ClinicPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте поля форми",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const sb = getServiceClient();
  // upsert singleton — рядок завжди є (засіяний), але робимо стійко.
  const { error } = await sb
    .from("clinic_info")
    .upsert({ id: "singleton", draft: parsed.data }, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidateContactPages();
  return { ok: true };
}

export async function publishClinic(): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { data, error: readErr } = await sb
    .from("clinic_info")
    .select("draft, published")
    .eq("id", "singleton")
    .maybeSingle();
  if (readErr) return { ok: false, error: readErr.message };
  const toPublish = data?.draft ?? data?.published;
  const parsed = ClinicPayloadSchema.safeParse(toPublish);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Дані контактів неповні",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const { error } = await sb
    .from("clinic_info")
    .upsert(
      { id: "singleton", published: parsed.data, draft: null },
      { onConflict: "id" },
    );
  if (error) return { ok: false, error: error.message };
  revalidateContactPages();
  return { ok: true };
}
