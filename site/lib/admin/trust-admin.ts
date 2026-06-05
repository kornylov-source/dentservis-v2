import "server-only";
import { getServiceClient } from "@/lib/supabase/server";
import type { TrustStatPayload } from "@/lib/supabase/types";

export type TrustAdminRow = {
  id: string;
  slug: string;
  status: string;
  sort_order: number;
  published: TrustStatPayload | null;
  draft: TrustStatPayload | null;
  updated_at: string;
};

export async function listTrustAdmin(): Promise<TrustAdminRow[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("trust_stats")
    .select("id, slug, status, sort_order, published, draft, updated_at")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[trust-admin] list error:", error.message);
    return [];
  }
  return (data ?? []) as TrustAdminRow[];
}

export async function getTrustAdmin(id: string): Promise<TrustAdminRow | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("trust_stats")
    .select("id, slug, status, sort_order, published, draft, updated_at")
    .eq("id", id)
    .single();
  if (error) {
    console.error("[trust-admin] get error:", error.message);
    return null;
  }
  return data as TrustAdminRow;
}

export function trustRowState(
  row: TrustAdminRow,
): "published" | "draft" | "unpublished_changes" {
  if (row.draft && row.published) return "unpublished_changes";
  if (row.published) return "published";
  return "draft";
}
