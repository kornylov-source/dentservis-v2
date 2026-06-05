import "server-only";
import { getServiceClient } from "@/lib/supabase/server";
import type { ReviewPayload } from "@/lib/supabase/types";

export type ReviewAdminRow = {
  id: string;
  slug: string;
  status: string;
  sort_order: number;
  published: ReviewPayload | null;
  draft: ReviewPayload | null;
  updated_at: string;
};

export async function listReviewsAdmin(): Promise<ReviewAdminRow[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("reviews")
    .select("id, slug, status, sort_order, published, draft, updated_at")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[reviews-admin] list error:", error.message);
    return [];
  }
  return (data ?? []) as ReviewAdminRow[];
}

export async function getReviewAdmin(id: string): Promise<ReviewAdminRow | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("reviews")
    .select("id, slug, status, sort_order, published, draft, updated_at")
    .eq("id", id)
    .single();
  if (error) {
    console.error("[reviews-admin] get error:", error.message);
    return null;
  }
  return data as ReviewAdminRow;
}

export function reviewRowState(
  row: ReviewAdminRow,
): "published" | "draft" | "unpublished_changes" {
  if (row.draft && row.published) return "unpublished_changes";
  if (row.published) return "published";
  return "draft";
}
