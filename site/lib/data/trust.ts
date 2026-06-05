import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";
import type { TrustStatPayload } from "@/lib/supabase/types";

export interface TrustStat {
  slug: string;
  number: string;
  label: string;
}

function mapPayload(slug: string, p: TrustStatPayload): TrustStat {
  return { slug, number: p.number, label: p.label };
}

async function fetchPublishedTrustStats(): Promise<TrustStat[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("trust_stats")
      .select("slug, sort_order, published")
      .not("published", "is", null)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[trust] fetchPublished error:", error.message);
      return [];
    }
    return (data ?? []).map((r) =>
      mapPayload(r.slug as string, r.published as TrustStatPayload),
    );
  } catch (e) {
    console.error("[trust] fetchPublished exception:", e);
    return [];
  }
}

export const getPublishedTrustStats = cache(fetchPublishedTrustStats);

async function fetchPreviewTrustStats(): Promise<TrustStat[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("trust_stats")
      .select("slug, sort_order, published, draft")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[trust] fetchPreview error:", error.message);
      return [];
    }
    return (data ?? [])
      .map((r) => {
        const payload = (r.draft ?? r.published) as TrustStatPayload | null;
        return payload ? mapPayload(r.slug as string, payload) : null;
      })
      .filter((t): t is TrustStat => t !== null);
  } catch (e) {
    console.error("[trust] fetchPreview exception:", e);
    return [];
  }
}

export async function getTrustStats(): Promise<TrustStat[]> {
  const { isEnabled } = await draftMode();
  return isEnabled ? fetchPreviewTrustStats() : getPublishedTrustStats();
}
