"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";
import { optimizeToWebp, IMAGE_MAX_WIDTH } from "@/lib/admin/optimize-image";
import {
  DoctorPayloadSchema,
  SlugSchema,
  flattenZodError,
} from "@/lib/admin/schemas";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Флашимо статичний HTML усіх сторінок, що показують лікарів. */
function revalidateDoctorPages() {
  revalidatePath("/");
  revalidatePath("/likari");
  revalidatePath("/likari/[slug]", "page");
}

export async function saveDoctorDraft(
  id: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = DoctorPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте поля форми",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const sb = getServiceClient();
  const { error } = await sb
    .from("doctors")
    .update({ draft: parsed.data })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function publishDoctor(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { data, error: readErr } = await sb
    .from("doctors")
    .select("slug, draft, published")
    .eq("id", id)
    .single();
  if (readErr || !data) return { ok: false, error: "Лікаря не знайдено" };

  const toPublish = data.draft ?? data.published;
  const parsed = DoctorPayloadSchema.safeParse(toPublish);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Дані лікаря неповні — заповніть усі обов'язкові поля",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const { error } = await sb
    .from("doctors")
    .update({ published: parsed.data, draft: null, status: "published" })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateDoctorPages();
  return { ok: true };
}

export async function createDoctor(
  slug: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const slugParsed = SlugSchema.safeParse(slug);
  if (!slugParsed.success) {
    const msg = slugParsed.error.issues[0].message;
    return { ok: false, error: msg, fieldErrors: { slug: msg } };
  }
  const parsed = DoctorPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте поля форми",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const sb = getServiceClient();
  const { data: maxRow } = await sb
    .from("doctors")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await sb.from("doctors").insert({
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
        error: "Лікар з таким slug вже існує",
        fieldErrors: { slug: "Цей slug вже зайнятий" },
      };
    }
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteDoctor(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { error } = await sb.from("doctors").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateDoctorPages();
  return { ok: true };
}

export async function reorderDoctors(
  orderedIds: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await sb
      .from("doctors")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
    if (error) return { ok: false, error: error.message };
  }
  revalidateDoctorPages();
  return { ok: true };
}

export async function uploadDoctorPhoto(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Файл не вибрано" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Фото більше 5 МБ — стисніть або виберіть менше" };
  }
  const okTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!okTypes.includes(file.type)) {
    return { ok: false, error: "Лише JPG, PNG або WEBP" };
  }
  const { buffer, ext, contentType } = await optimizeToWebp(
    file,
    IMAGE_MAX_WIDTH.doctor,
  );
  const path = `doctors/${crypto.randomUUID()}.${ext}`;
  const sb = getServiceClient();
  const { error } = await sb.storage
    .from("media")
    .upload(path, buffer, { contentType, upsert: false });
  if (error) return { ok: false, error: error.message };
  const { data } = sb.storage.from("media").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
