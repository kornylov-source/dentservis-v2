import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";

export type ServiceStage = {
  number: string;
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  name: string;
  heroTitle?: string;
  heroAccent?: string;
  short: string;
  hidden?: boolean;
  iconType:
    | "implant"
    | "orthopedic"
    | "surgery"
    | "therapy"
    | "perio"
    | "ortho"
    | "esthetic"
    | "hygiene";
  image: string;
  hero: {
    headline: string;
    intro: string;
    benefits: string[];
  };
  problems: { title: string; description: string }[];
  stages: ServiceStage[];
  doctors: string[];
  doctorRoles?: Record<string, string>;
  standards: string[];
  faq: ServiceFaq[];
};

/** payload = Service без slug/hidden (вони — окремі колонки). */
type ServicePayload = Omit<Service, "slug" | "hidden">;

function mapRow(slug: string, hidden: boolean, p: ServicePayload): Service {
  return { slug, hidden, ...p };
}

// --- Опубліковані й видимі (not hidden), кешовано. Каталог/sitemap/бот/build. ---
async function fetchPublishedServices(): Promise<Service[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("services")
      .select("slug, hidden, published")
      .not("published", "is", null)
      .eq("hidden", false)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[services] fetchPublished error:", error.message);
      return [];
    }
    return (data ?? []).map((r) =>
      mapRow(r.slug as string, r.hidden as boolean, r.published as ServicePayload),
    );
  } catch (e) {
    console.error("[services] fetchPublished exception:", e);
    return [];
  }
}

export const getPublishedServices = cache(fetchPublishedServices);

export async function getPublishedService(
  slug: string,
): Promise<Service | undefined> {
  const all = await getPublishedServices();
  return all.find((s) => s.slug === slug);
}

export async function getAllServiceSlugs(): Promise<{ slug: string }[]> {
  const all = await getPublishedServices();
  return all.map((s) => ({ slug: s.slug }));
}

// --- Каталог draft-aware (видимі): preview показує чернетку. ---
async function fetchPreviewServices(): Promise<Service[]> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("services")
    .select("slug, hidden, published, draft")
    .eq("hidden", false)
    .order("sort_order", { ascending: true });
  return (data ?? [])
    .map((r) => {
      const p = (r.draft ?? r.published) as ServicePayload | null;
      return p ? mapRow(r.slug as string, r.hidden as boolean, p) : null;
    })
    .filter((s): s is Service => s !== null);
}

export async function getServices(): Promise<Service[]> {
  const { isEnabled } = await draftMode();
  return isEnabled ? fetchPreviewServices() : getPublishedServices();
}

// --- Одна послуга за slug (детальна). Draft-aware. Приховані сторінка сама 404-ить. ---
export async function getServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    const sb = getServiceClient();
    const { data } = await sb
      .from("services")
      .select("slug, hidden, published, draft")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return undefined;
    const p = (data.draft ?? data.published) as ServicePayload | null;
    return p ? mapRow(data.slug as string, data.hidden as boolean, p) : undefined;
  }
  const all = await getPublishedServices();
  return all.find((s) => s.slug === slug);
}
