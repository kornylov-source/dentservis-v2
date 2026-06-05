"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";
import { SlugSchema, flattenZodError } from "@/lib/admin/schemas";
import { TrustStatPayloadSchema } from "@/lib/admin/trust-schema";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

// Trust-bar лише на головній.
function revalidateTrustPages() {
  revalidatePath("/");
}

export async function saveTrustDraft(
  id: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = TrustStatPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте поля форми",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const sb = getServiceClient();
  const { error } = await sb
    .from("trust_stats")
    .update({ draft: parsed.data })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTrustPages();
  return { ok: true };
}

export async function publishTrust(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { data, error: readErr } = await sb
    .from("trust_stats")
    .select("draft, published")
    .eq("id", id)
    .single();
  if (readErr || !data) return { ok: false, error: "Запис не знайдено" };
  const toPublish = data.draft ?? data.published;
  const parsed = TrustStatPayloadSchema.safeParse(toPublish);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Дані неповні",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const { error } = await sb
    .from("trust_stats")
    .update({ published: parsed.data, draft: null, status: "published" })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTrustPages();
  return { ok: true };
}

export async function createTrust(
  slug: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const slugParsed = SlugSchema.safeParse(slug);
  if (!slugParsed.success) {
    const msg = slugParsed.error.issues[0].message;
    return { ok: false, error: msg, fieldErrors: { slug: msg } };
  }
  const parsed = TrustStatPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте поля форми",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const sb = getServiceClient();
  const { data: maxRow } = await sb
    .from("trust_stats")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (maxRow?.sort_order ?? -1) + 1;
  const { error } = await sb.from("trust_stats").insert({
    slug: slugParsed.data,
    status: "draft",
    sort_order: sortOrder,
    draft: parsed.data,
    published: null,
  });
  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "Запис з таким slug вже існує",
        fieldErrors: { slug: "Цей slug вже зайнятий" },
      };
    }
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteTrust(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { error } = await sb.from("trust_stats").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTrustPages();
  return { ok: true };
}
