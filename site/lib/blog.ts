import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";
import type { BlogPostPayload } from "@/lib/supabase/types";
import {
  type BlogCategory,
  type BlogPost,
  CATEGORY_ORDER,
} from "@/lib/blog-shared";

// Реекспорт чистих частин — щоб наявні серверні імпорти `from "@/lib/blog"` працювали.
export {
  type BlogCategory,
  type BlogFaq,
  type BlogPost,
  CATEGORY_META,
  CATEGORY_ORDER,
  calculateReadingTime,
  formatDateUk,
} from "@/lib/blog-shared";

const VALID_CATEGORIES = new Set<string>(CATEGORY_ORDER);

function mapPayload(p: BlogPostPayload): BlogPost {
  const category = (
    VALID_CATEGORIES.has(p.category) ? p.category : "porady"
  ) as BlogCategory;
  return {
    slug: "", // перезаписується в fetch (slug — окрема колонка)
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category,
    authorSlug: p.authorSlug,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    featuredImage: p.featuredImage,
    imageAlt: p.imageAlt,
    readingTimeMin: p.readingTimeMin,
    seo: p.seo,
    faq: p.faq,
  };
}

// --- Опубліковані статті: кешовано per-request, відсортовано за датою (новіші перші). ---
async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug, published_at, published")
      .not("published", "is", null)
      .order("published_at", { ascending: false });
    if (error) {
      console.error("[blog] fetchPublished error:", error.message);
      return [];
    }
    return (data ?? []).map((r) => ({
      ...mapPayload(r.published as BlogPostPayload),
      slug: r.slug as string,
    }));
  } catch (e) {
    console.error("[blog] fetchPublished exception:", e);
    return [];
  }
}

export const getPublishedPosts = cache(fetchPublishedPosts);

// --- Draft-aware (для preview): coalesce(draft, published), без кешу. ---
async function fetchPreviewPosts(): Promise<BlogPost[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug, published_at, published, draft")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("[blog] fetchPreview error:", error.message);
      return [];
    }
    return (data ?? [])
      .map((r) => {
        const payload = (r.draft ?? r.published) as BlogPostPayload | null;
        return payload
          ? { ...mapPayload(payload), slug: r.slug as string }
          : null;
      })
      .filter((p): p is BlogPost => p !== null);
  } catch (e) {
    console.error("[blog] fetchPreview exception:", e);
    return [];
  }
}

async function resolvePosts(): Promise<BlogPost[]> {
  const { isEnabled } = await draftMode();
  return isEnabled ? fetchPreviewPosts() : getPublishedPosts();
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return resolvePosts();
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const all = await resolvePosts();
  return all.find((p) => p.slug === slug);
}

export async function getPostsByCategory(
  category: BlogCategory,
): Promise<BlogPost[]> {
  const all = await resolvePosts();
  return all.filter((p) => p.category === category);
}

export async function getRelatedPosts(
  slug: string,
  limit = 3,
): Promise<BlogPost[]> {
  const all = await resolvePosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  const sameCategory = all.filter(
    (p) => p.category === current.category && p.slug !== slug,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = all.filter(
    (p) => p.category !== current.category && p.slug !== slug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
