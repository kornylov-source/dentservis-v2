"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";
import { flattenZodError } from "@/lib/admin/schemas";
import {
  FaqGroupPayloadSchema,
  FaqItemPayloadSchema,
} from "@/lib/admin/faq-schema";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function revalidateFaq() {
  revalidatePath("/faq");
}

async function nextSortOrder(
  table: "faq_groups" | "faq_items",
  groupId?: string,
): Promise<number> {
  const sb = getServiceClient();
  let q = sb.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (table === "faq_items" && groupId) q = q.eq("group_id", groupId);
  const { data } = await q.maybeSingle();
  return ((data?.sort_order as number | undefined) ?? -1) + 1;
}

/* ---------------------------------- Групи --------------------------------- */

export async function createFaqGroup(payload: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = FaqGroupPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: "Перевірте поля форми", fieldErrors: flattenZodError(parsed.error) };
  }
  const sb = getServiceClient();
  const sortOrder = await nextSortOrder("faq_groups");
  const { error } = await sb
    .from("faq_groups")
    .insert({ status: "draft", sort_order: sortOrder, draft: parsed.data, published: null });
  if (error) return { ok: false, error: error.message };
  revalidateFaq();
  return { ok: true };
}

export async function saveFaqGroupDraft(
  id: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = FaqGroupPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: "Перевірте поля форми", fieldErrors: flattenZodError(parsed.error) };
  }
  const sb = getServiceClient();
  const { error } = await sb.from("faq_groups").update({ draft: parsed.data }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateFaq();
  return { ok: true };
}

export async function publishFaqGroup(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { data, error: readErr } = await sb
    .from("faq_groups")
    .select("draft, published")
    .eq("id", id)
    .single();
  if (readErr || !data) return { ok: false, error: "Групу не знайдено" };
  const parsed = FaqGroupPayloadSchema.safeParse(data.draft ?? data.published);
  if (!parsed.success) {
    return { ok: false, error: "Дані групи неповні", fieldErrors: flattenZodError(parsed.error) };
  }
  const { error } = await sb
    .from("faq_groups")
    .update({ published: parsed.data, draft: null, status: "published" })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateFaq();
  return { ok: true };
}

export async function deleteFaqGroup(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  // faq_items видаляться каскадно (ON DELETE CASCADE).
  const { error } = await sb.from("faq_groups").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateFaq();
  return { ok: true };
}

/* --------------------------------- Питання -------------------------------- */

export async function createFaqItem(
  groupId: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = FaqItemPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: "Перевірте поля форми", fieldErrors: flattenZodError(parsed.error) };
  }
  const sb = getServiceClient();
  const sortOrder = await nextSortOrder("faq_items", groupId);
  const { error } = await sb.from("faq_items").insert({
    group_id: groupId,
    status: "draft",
    sort_order: sortOrder,
    draft: parsed.data,
    published: null,
  });
  if (error) return { ok: false, error: error.message };
  revalidateFaq();
  return { ok: true };
}

export async function saveFaqItemDraft(
  id: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = FaqItemPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: "Перевірте поля форми", fieldErrors: flattenZodError(parsed.error) };
  }
  const sb = getServiceClient();
  const { error } = await sb.from("faq_items").update({ draft: parsed.data }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateFaq();
  return { ok: true };
}

export async function publishFaqItem(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { data, error: readErr } = await sb
    .from("faq_items")
    .select("draft, published")
    .eq("id", id)
    .single();
  if (readErr || !data) return { ok: false, error: "Питання не знайдено" };
  const parsed = FaqItemPayloadSchema.safeParse(data.draft ?? data.published);
  if (!parsed.success) {
    return { ok: false, error: "Дані питання неповні", fieldErrors: flattenZodError(parsed.error) };
  }
  const { error } = await sb
    .from("faq_items")
    .update({ published: parsed.data, draft: null, status: "published" })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateFaq();
  return { ok: true };
}

export async function deleteFaqItem(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { error } = await sb.from("faq_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateFaq();
  return { ok: true };
}
