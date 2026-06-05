"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";
import { SlugSchema, flattenZodError } from "@/lib/admin/schemas";
import { BlogPostPayloadSchema } from "@/lib/admin/blog-schema";
import { sanitizeArticleHtml } from "@/lib/admin/sanitize-html";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function revalidateBlogPages() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/category/[slug]", "page");
}

// Колонки-дзеркала для індексів/сортування/sitemap.
function mirrorColumns(payload: {
  category: string;
  authorSlug: string;
  publishedAt: string;
}) {
  return {
    category: payload.category,
    author_slug: payload.authorSlug,
    published_at: payload.publishedAt,
  };
}

// Валідація + ОБОВ'ЯЗКОВА санітизація тіла перед записом у БД.
function validateAndSanitize(payload: unknown) {
  const parsed = BlogPostPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Перевірте поля форми",
      fieldErrors: flattenZodError(parsed.error),
    };
  }
  const clean = {
    ...parsed.data,
    content: sanitizeArticleHtml(parsed.data.content),
  };
  return { ok: true as const, data: clean };
}

export async function saveBlogDraft(
  id: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const v = validateAndSanitize(payload);
  if (!v.ok) return v;
  const sb = getServiceClient();
  const { error } = await sb
    .from("blog_posts")
    .update({ draft: v.data, ...mirrorColumns(v.data) })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateBlogPages();
  return { ok: true };
}

export async function publishBlog(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { data, error: readErr } = await sb
    .from("blog_posts")
    .select("draft, published")
    .eq("id", id)
    .single();
  if (readErr || !data) return { ok: false, error: "Статтю не знайдено" };
  const toPublish = data.draft ?? data.published;
  const v = validateAndSanitize(toPublish);
  if (!v.ok) {
    return { ...v, error: "Дані статті неповні — заповніть усі обов'язкові поля" };
  }
  const { error } = await sb
    .from("blog_posts")
    .update({
      published: v.data,
      draft: null,
      status: "published",
      ...mirrorColumns(v.data),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateBlogPages();
  return { ok: true };
}

export async function createBlog(
  slug: string,
  payload: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const slugParsed = SlugSchema.safeParse(slug);
  if (!slugParsed.success) {
    const msg = slugParsed.error.issues[0].message;
    return { ok: false, error: msg, fieldErrors: { slug: msg } };
  }
  const v = validateAndSanitize(payload);
  if (!v.ok) return v;
  const sb = getServiceClient();
  const { error } = await sb.from("blog_posts").insert({
    slug: slugParsed.data,
    status: "draft",
    draft: v.data,
    published: null,
    ...mirrorColumns(v.data),
  });
  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "Стаття з таким slug вже існує",
        fieldErrors: { slug: "Цей slug вже зайнятий" },
      };
    }
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  await requireAdmin();
  const sb = getServiceClient();
  const { error } = await sb.from("blog_posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateBlogPages();
  return { ok: true };
}

export async function uploadBlogImage(
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
  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `blog/${crypto.randomUUID()}.${ext}`;
  const sb = getServiceClient();
  const { error } = await sb.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { ok: false, error: error.message };
  const { data } = sb.storage.from("media").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
