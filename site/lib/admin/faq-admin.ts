import "server-only";
import { getServiceClient } from "@/lib/supabase/server";
import type { FaqGroupPayload, FaqItemPayload } from "@/lib/supabase/types";

export type FaqGroupAdminRow = {
  id: string;
  status: string;
  sort_order: number;
  published: FaqGroupPayload | null;
  draft: FaqGroupPayload | null;
  updated_at: string;
};

export type FaqItemAdminRow = {
  id: string;
  group_id: string;
  status: string;
  sort_order: number;
  published: FaqItemPayload | null;
  draft: FaqItemPayload | null;
  updated_at: string;
};

export type RowState = "published" | "draft" | "unpublished_changes";

function rowState(row: {
  published: unknown | null;
  draft: unknown | null;
}): RowState {
  if (row.draft && row.published) return "unpublished_changes";
  if (row.published) return "published";
  return "draft";
}

export const faqGroupState = rowState;
export const faqItemState = rowState;

export async function listFaqGroupsAdmin(): Promise<FaqGroupAdminRow[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("faq_groups")
    .select("id, status, sort_order, published, draft, updated_at")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[faq-admin] list groups error:", error.message);
    return [];
  }
  return (data ?? []) as FaqGroupAdminRow[];
}

export async function getFaqGroupAdmin(
  id: string,
): Promise<FaqGroupAdminRow | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("faq_groups")
    .select("id, status, sort_order, published, draft, updated_at")
    .eq("id", id)
    .single();
  if (error) {
    console.error("[faq-admin] get group error:", error.message);
    return null;
  }
  return data as FaqGroupAdminRow;
}

export async function listFaqItemsAdmin(
  groupId: string,
): Promise<FaqItemAdminRow[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("faq_items")
    .select("id, group_id, status, sort_order, published, draft, updated_at")
    .eq("group_id", groupId)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[faq-admin] list items error:", error.message);
    return [];
  }
  return (data ?? []) as FaqItemAdminRow[];
}

export async function getFaqItemAdmin(
  id: string,
): Promise<FaqItemAdminRow | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("faq_items")
    .select("id, group_id, status, sort_order, published, draft, updated_at")
    .eq("id", id)
    .single();
  if (error) {
    console.error("[faq-admin] get item error:", error.message);
    return null;
  }
  return data as FaqItemAdminRow;
}
