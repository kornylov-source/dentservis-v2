"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";
import { SlugSchema, flattenZodError } from "@/lib/admin/schemas";
import { ServicePayloadSchema } from "@/lib/admin/service-schema";
import { optimizeToWebp, IMAGE_MAX_WIDTH } from "@/lib/admin/optimize-image";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function revalidateServicePages() {
  revalidatePath("/");
  revalidatePath("/poslugy");
  revalidatePath("/poslugy/[slug]", "page");
}

export async function saveServiceDraft(
  id: string,
  payload: unknown,
  hidden: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = ServicePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте поля форми",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const sb = getServiceClient();
  const { error } = await sb
    .from("services")
    .update({ draft: parsed.data, hidden })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateServicePages();
  return { ok: true };
}

export async function publishService(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { data, error: readErr } = await sb
    .from("services")
    .select("draft, published")
    .eq("id", id)
    .single();
  if (readErr || !data) return { ok: false, error: "Послугу не знайдено" };
  const toPublish = data.draft ?? data.published;
  const parsed = ServicePayloadSchema.safeParse(toPublish);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Дані послуги неповні — заповніть усі обов'язкові поля",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const { error } = await sb
    .from("services")
    .update({ published: parsed.data, draft: null, status: "published" })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateServicePages();
  return { ok: true };
}

export async function createService(
  slug: string,
  payload: unknown,
  hidden: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const slugParsed = SlugSchema.safeParse(slug);
  if (!slugParsed.success) {
    const msg = slugParsed.error.issues[0].message;
    return { ok: false, error: msg, fieldErrors: { slug: msg } };
  }
  const parsed = ServicePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте поля форми",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const sb = getServiceClient();
  const { data: maxRow } = await sb
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (maxRow?.sort_order ?? -1) + 1;
  const { error } = await sb.from("services").insert({
    slug: slugParsed.data,
    status: "draft",
    sort_order: sortOrder,
    hidden,
    draft: parsed.data,
    published: null,
  });
  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "Послуга з таким slug вже існує",
        fieldErrors: { slug: "Цей slug вже зайнятий" },
      };
    }
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteService(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { error } = await sb.from("services").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateServicePages();
  return { ok: true };
}

export async function uploadServiceImage(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Файл не вибрано" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Зображення більше 5 МБ" };
  }
  const okTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!okTypes.includes(file.type)) {
    return { ok: false, error: "Лише JPG, PNG або WEBP" };
  }
  const { buffer, ext, contentType } = await optimizeToWebp(
    file,
    IMAGE_MAX_WIDTH.service,
  );
  const path = `services/${crypto.randomUUID()}.${ext}`;
  const sb = getServiceClient();
  const { error } = await sb.storage
    .from("media")
    .upload(path, buffer, { contentType, upsert: false });
  if (error) return { ok: false, error: error.message };
  const { data } = sb.storage.from("media").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
