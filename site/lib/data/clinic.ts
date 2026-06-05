import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";
import type { ClinicPayload } from "@/lib/supabase/types";
import { clinic as DEFAULTS } from "@/lib/clinic-contact";

export type ClinicInfo = ClinicPayload;

/**
 * Дефолти = поточні захардкоджені контакти (lib/clinic-contact.ts).
 * Якщо БД недоступна (Free засинає / помилка) — повертаємо їх, щоб сайт і бот
 * НІКОЛИ не лишилися без телефонів. БД лише ПЕРЕКРИВАЄ дефолти по полях.
 */
const FALLBACK: ClinicInfo = {
  name: DEFAULTS.name,
  legalName: DEFAULTS.legalName,
  city: DEFAULTS.city,
  address: DEFAULTS.address,
  phone: DEFAULTS.phone,
  phoneIntl: DEFAULTS.phoneIntl,
  phone2: DEFAULTS.phone2,
  phone2Intl: DEFAULTS.phone2Intl,
  schedule: { ...DEFAULTS.schedule },
  scheduleShort: DEFAULTS.scheduleShort,
  parking: DEFAULTS.parking,
  website: DEFAULTS.website,
  contactsUrl: DEFAULTS.contactsUrl,
  mapsUrl: "https://maps.app.goo.gl/T6QnGrqqXjCfwm2p9",
};

async function fetchClinic(column: "published" | "draft" | "both"): Promise<ClinicInfo> {
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("clinic_info")
      .select("published, draft")
      .eq("id", "singleton")
      .maybeSingle();
    if (error) {
      console.error("[clinic] fetch error:", error.message);
      return FALLBACK;
    }
    const published = (data?.published ?? null) as Partial<ClinicInfo> | null;
    const draft = (data?.draft ?? null) as Partial<ClinicInfo> | null;
    const chosen =
      column === "published"
        ? published
        : column === "draft"
          ? draft
          : (draft ?? published); // "both" = coalesce(draft, published)
    // БД перекриває дефолти, але порожні поля БД не затирають fallback.
    return chosen ? { ...FALLBACK, ...chosen } : FALLBACK;
  } catch (e) {
    console.error("[clinic] fetch exception:", e);
    return FALLBACK;
  }
}

// Опубліковані контакти, кешовано per-request. Для бота, privacy, статичних сторінок.
export const getPublishedClinic = cache(() => fetchClinic("published"));

// Draft-aware (для preview контактів).
export async function getClinicInfo(): Promise<ClinicInfo> {
  const { isEnabled } = await draftMode();
  return isEnabled ? fetchClinic("both") : getPublishedClinic();
}
