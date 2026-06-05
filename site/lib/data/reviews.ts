import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";
import type { ReviewPayload } from "@/lib/supabase/types";

export interface Review {
  slug: string;
  author: string;
  text: string;
  avatar: string;
  stars: number;
}

function mapPayload(slug: string, p: ReviewPayload): Review {
  return {
    slug,
    author: p.author,
    text: p.text,
    avatar: p.avatar,
    stars: p.stars,
  };
}

// --- Опубліковані відгуки: кешовано per-request. Безпечно у build-контексті. ---
async function fetchPublishedReviews(): Promise<Review[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("reviews")
      .select("slug, sort_order, published")
      .not("published", "is", null)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[reviews] fetchPublished error:", error.message);
      return [];
    }
    return (data ?? []).map((r) =>
      mapPayload(r.slug as string, r.published as ReviewPayload),
    );
  } catch (e) {
    console.error("[reviews] fetchPublished exception:", e);
    return [];
  }
}

export const getPublishedReviews = cache(fetchPublishedReviews);

// --- Draft-aware: у режимі preview показує coalesce(draft, published), без кешу. ---
async function fetchPreviewReviews(): Promise<Review[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("reviews")
      .select("slug, sort_order, published, draft")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[reviews] fetchPreview error:", error.message);
      return [];
    }
    return (data ?? [])
      .map((r) => {
        const payload = (r.draft ?? r.published) as ReviewPayload | null;
        return payload ? mapPayload(r.slug as string, payload) : null;
      })
      .filter((r): r is Review => r !== null);
  } catch (e) {
    console.error("[reviews] fetchPreview exception:", e);
    return [];
  }
}

export async function getReviews(): Promise<Review[]> {
  const { isEnabled } = await draftMode();
  return isEnabled ? fetchPreviewReviews() : getPublishedReviews();
}
