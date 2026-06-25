import Link from "next/link";
import ContactForm, { type ContactFormData } from "@/components/admin/ContactForm";
import { getServiceClient } from "@/lib/supabase/server";
import { clinic as DEFAULTS } from "@/lib/clinic-contact";
import type { ClinicPayload } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

async function loadClinic(): Promise<ContactFormData> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("clinic_info")
    .select("published, draft")
    .eq("id", "singleton")
    .maybeSingle();
  const p = ((data?.draft ?? data?.published) as Partial<ClinicPayload> | null) ?? null;

  return {
    name: p?.name ?? DEFAULTS.name,
    legalName: p?.legalName ?? DEFAULTS.legalName,
    city: p?.city ?? DEFAULTS.city,
    address: p?.address ?? DEFAULTS.address,
    phone: p?.phone ?? DEFAULTS.phone,
    phoneIntl: p?.phoneIntl ?? DEFAULTS.phoneIntl,
    phone2: p?.phone2 ?? DEFAULTS.phone2,
    phone2Intl: p?.phone2Intl ?? DEFAULTS.phone2Intl,
    scheduleWeekdays: p?.schedule?.weekdays ?? DEFAULTS.schedule.weekdays,
    scheduleSaturday: p?.schedule?.saturday ?? DEFAULTS.schedule.saturday,
    scheduleSunday: p?.schedule?.sunday ?? DEFAULTS.schedule.sunday,
    scheduleShort: p?.scheduleShort ?? DEFAULTS.scheduleShort,
    parking: p?.parking ?? DEFAULTS.parking,
    website: p?.website ?? DEFAULTS.website,
    contactsUrl: p?.contactsUrl ?? DEFAULTS.contactsUrl,
    mapsUrl: p?.mapsUrl ?? "https://maps.app.goo.gl/T6QnGrqqXjCfwm2p9",
    telegram: p?.telegram ?? DEFAULTS.telegram,
    viberPhone: p?.viberPhone ?? DEFAULTS.viberPhone,
  };
}

export default async function ContactsAdminPage() {
  const initial = await loadClinic();
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/admin" className="text-sm text-slate-500 hover:underline">
        ← На головну адмінки
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold tracking-tight">
        Контакти клініки
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Телефони, адреса, графік. Один запис — використовується скрізь.
      </p>
      <ContactForm initial={initial} />
    </main>
  );
}
