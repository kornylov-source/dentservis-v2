import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";
import type { FaqGroupPayload, FaqItemPayload } from "@/lib/supabase/types";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  badge: string;
  title: string;
  items: FaqItem[];
}

type GroupRow = {
  id: string;
  sort_order: number;
  published: FaqGroupPayload | null;
  draft: FaqGroupPayload | null;
};
type ItemRow = {
  id: string;
  group_id: string;
  sort_order: number;
  published: FaqItemPayload | null;
  draft: FaqItemPayload | null;
};

/**
 * Збирає групи з вкладеними питаннями. `mode`:
 *  - "published": лише published (для сайту, кешовано).
 *  - "preview": coalesce(draft, published) (для draftMode).
 * Порожні групи (без видимих питань) все одно показуємо — щоб бейдж/заголовок
 * було видно у preview одразу після створення.
 */
async function fetchFaq(mode: "published" | "preview"): Promise<FaqGroup[]> {
  try {
    const sb = getServiceClient();
    const [groupsRes, itemsRes] = await Promise.all([
      sb
        .from("faq_groups")
        .select("id, sort_order, published, draft")
        .order("sort_order", { ascending: true }),
      sb
        .from("faq_items")
        .select("id, group_id, sort_order, published, draft")
        .order("sort_order", { ascending: true }),
    ]);
    if (groupsRes.error) {
      console.error("[faq] groups error:", groupsRes.error.message);
      return [];
    }
    if (itemsRes.error) {
      console.error("[faq] items error:", itemsRes.error.message);
      return [];
    }
    const pick = <T,>(published: T | null, draft: T | null): T | null =>
      mode === "preview" ? (draft ?? published) : published;

    const itemsByGroup = new Map<string, FaqItem[]>();
    for (const r of (itemsRes.data ?? []) as ItemRow[]) {
      const p = pick(r.published, r.draft);
      if (!p) continue;
      const arr = itemsByGroup.get(r.group_id) ?? [];
      arr.push({ id: r.id, question: p.question, answer: p.answer });
      itemsByGroup.set(r.group_id, arr);
    }

    const groups: FaqGroup[] = [];
    for (const g of (groupsRes.data ?? []) as GroupRow[]) {
      const p = pick(g.published, g.draft);
      if (!p) continue;
      groups.push({
        id: g.id,
        badge: p.badge,
        title: p.title,
        items: itemsByGroup.get(g.id) ?? [],
      });
    }
    return groups;
  } catch (e) {
    console.error("[faq] exception:", e);
    return [];
  }
}

export const getPublishedFaq = cache(() => fetchFaq("published"));

export async function getFaq(): Promise<FaqGroup[]> {
  const { isEnabled } = await draftMode();
  return isEnabled ? fetchFaq("preview") : getPublishedFaq();
}
