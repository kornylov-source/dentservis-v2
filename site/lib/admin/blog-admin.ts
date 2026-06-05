import "server-only";
import { getServiceClient } from "@/lib/supabase/server";
import type { BlogPostPayload } from "@/lib/supabase/types";

export type BlogAdminRow = {
  id: string;
  slug: string;
  status: string;
  category: string;
  author_slug: string | null;
  published_at: string | null;
  published: BlogPostPayload | null;
  draft: BlogPostPayload | null;
  updated_at: string;
};

export async function listBlogAdmin(): Promise<BlogAdminRow[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("blog_posts")
    .select(
      "id, slug, status, category, author_slug, published_at, published, draft, updated_at",
    )
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("[blog-admin] list error:", error.message);
    return [];
  }
  return (data ?? []) as BlogAdminRow[];
}

export async function getBlogAdmin(id: string): Promise<BlogAdminRow | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("blog_posts")
    .select(
      "id, slug, status, category, author_slug, published_at, published, draft, updated_at",
    )
    .eq("id", id)
    .single();
  if (error) {
    console.error("[blog-admin] get error:", error.message);
    return null;
  }
  return data as BlogAdminRow;
}

export function blogRowState(
  row: BlogAdminRow,
): "published" | "draft" | "unpublished_changes" {
  if (row.draft && row.published) return "unpublished_changes";
  if (row.published) return "published";
  return "draft";
}
