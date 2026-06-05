import "server-only";
import { getServiceClient } from "@/lib/supabase/server";
import type { DoctorPayload } from "@/lib/supabase/types";

/** Рядок лікаря як він є в БД (для адмінки — з усіма станами). */
export type DoctorAdminRow = {
  id: string;
  slug: string;
  status: string;
  sort_order: number;
  published: DoctorPayload | null;
  draft: DoctorPayload | null;
  updated_at: string;
};

export async function listDoctorsAdmin(): Promise<DoctorAdminRow[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("doctors")
    .select("id, slug, status, sort_order, published, draft, updated_at")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[doctors-admin] list error:", error.message);
    return [];
  }
  return (data ?? []) as DoctorAdminRow[];
}

export async function getDoctorAdmin(
  id: string,
): Promise<DoctorAdminRow | null> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("doctors")
    .select("id, slug, status, sort_order, published, draft, updated_at")
    .eq("id", id)
    .single();
  if (error) {
    console.error("[doctors-admin] get error:", error.message);
    return null;
  }
  return data as DoctorAdminRow;
}

/** Стан рядка для відображення в списку. */
export function rowState(
  row: DoctorAdminRow,
): "published" | "draft" | "unpublished_changes" {
  if (row.draft && row.published) return "unpublished_changes";
  if (row.published) return "published";
  return "draft";
}
