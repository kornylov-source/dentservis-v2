import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";
import type { DoctorPayload } from "@/lib/supabase/types";

export interface Doctor {
  slug: string;
  fullName: string;
  shortName: string;
  position: string;
  experience: string;
  photo: string; // детальне фото (1:1) — використовує DoctorDetail
  photoCard: string; // фото картки (4:5) — список і карусель
  specialty: string;
  cardSpecialty: string;
  cardExperienceList: string;
  cardExperienceCarousel: string;
  bio: string[];
  highlights?: { title: string; description: string }[];
  training?: string[];
  expertise?: string;
  quote?: string;
  hobby?: string;
}

function mapPayload(slug: string, p: DoctorPayload): Doctor {
  return {
    slug,
    fullName: p.fullName,
    shortName: p.shortName,
    position: p.position,
    experience: p.experience,
    photo: p.photoDetail,
    photoCard: p.photoCard,
    specialty: p.specialty,
    cardSpecialty: p.cardSpecialty,
    cardExperienceList: p.cardExperienceList,
    cardExperienceCarousel: p.cardExperienceCarousel,
    bio: p.bio,
    highlights: p.highlights ?? undefined,
    training: p.training ?? undefined,
    expertise: p.expertise ?? undefined,
    quote: p.quote ?? undefined,
    hobby: p.hobby ?? undefined,
  };
}

// --- Опубліковані лікарі: кешовано, тегом 'doctors'. Безпечно у build-/metadata-/
// sitemap-/бот-/послуги-контексті (без draftMode). Інвалідується updateTag('doctors'). ---
async function fetchPublishedDoctors(): Promise<Doctor[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("doctors")
      .select("slug, sort_order, published")
      .not("published", "is", null)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[doctors] fetchPublished error:", error.message);
      return [];
    }
    return (data ?? []).map((r) =>
      mapPayload(r.slug as string, r.published as DoctorPayload),
    );
  } catch (e) {
    console.error("[doctors] fetchPublished exception:", e);
    return [];
  }
}

// Per-request memoization (React cache). Без cross-request кешу: статичні сторінки
// тримають дані з моменту білда/ревалідації; updateDoctors-actions роблять
// revalidatePath, тож після публікації сторінки регенеруються свіжими.
export const getPublishedDoctors = cache(fetchPublishedDoctors);

export async function getPublishedDoctor(
  slug: string,
): Promise<Doctor | undefined> {
  const all = await getPublishedDoctors();
  return all.find((d) => d.slug === slug);
}

export async function getAllDoctorSlugs(): Promise<{ slug: string }[]> {
  const all = await getPublishedDoctors();
  return all.map((d) => ({ slug: d.slug }));
}

// --- Draft-aware: у режимі preview (draftMode) показує coalesce(draft, published),
// без кешу. Для рендеру сторінок лікарів (список / карусель / детальна). ---
async function fetchPreviewDoctors(): Promise<Doctor[]> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("doctors")
      .select("slug, sort_order, published, draft")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[doctors] fetchPreview error:", error.message);
      return [];
    }
    return (data ?? [])
      .map((r) => {
        const payload = (r.draft ?? r.published) as DoctorPayload | null;
        return payload ? mapPayload(r.slug as string, payload) : null;
      })
      .filter((d): d is Doctor => d !== null);
  } catch (e) {
    console.error("[doctors] fetchPreview exception:", e);
    return [];
  }
}

export async function getDoctors(): Promise<Doctor[]> {
  const { isEnabled } = await draftMode();
  return isEnabled ? fetchPreviewDoctors() : getPublishedDoctors();
}

export async function getDoctor(slug: string): Promise<Doctor | undefined> {
  const all = await getDoctors();
  return all.find((d) => d.slug === slug);
}
