import "server-only";
import { getServiceClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/services";

type ServicePayload = Omit<Service, "slug" | "hidden">;

export type ServiceAdminRow = {
  id: string;
  slug: string;
  status: string;
  sort_order: number;
  hidden: boolean;
  published: ServicePayload | null;
  draft: ServicePayload | null;
  updated_at: string;
};

export async function listServicesAdmin(): Promise<ServiceAdminRow[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("services")
    .select("id, slug, status, sort_order, hidden, published, draft, updated_at")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[services-admin] list error:", error.message);
    return [];
  }
  return (data ?? []) as ServiceAdminRow[];
}

export async function getServiceAdmin(
  id: string,
): Promise<ServiceAdminRow | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("services")
    .select("id, slug, status, sort_order, hidden, published, draft, updated_at")
    .eq("id", id)
    .single();
  if (error) {
    console.error("[services-admin] get error:", error.message);
    return null;
  }
  return data as ServiceAdminRow;
}

export function svcRowState(
  row: ServiceAdminRow,
): "published" | "draft" | "unpublished_changes" {
  if (row.draft && row.published) return "unpublished_changes";
  if (row.published) return "published";
  return "draft";
}
