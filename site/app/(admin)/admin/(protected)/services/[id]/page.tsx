import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceForm, {
  EMPTY_SERVICE,
  type ServiceFormData,
} from "@/components/admin/ServiceForm";
import { getServiceAdmin } from "@/lib/admin/services-admin";
import { getPublishedDoctors } from "@/lib/data/doctors";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getServiceAdmin(id);
  if (!row) notFound();

  const doctors = await getPublishedDoctors();
  const availableDoctors = doctors.map((d) => ({
    slug: d.slug,
    name: d.fullName,
  }));

  const p = row.draft ?? row.published;
  const initial: ServiceFormData = p
    ? {
        name: p.name,
        short: p.short,
        image: p.image,
        iconType: p.iconType,
        hidden: row.hidden,
        heroTitle: p.heroTitle ?? "",
        heroAccent: p.heroAccent ?? "",
        heroHeadline: p.hero?.headline ?? "",
        heroIntro: p.hero?.intro ?? "",
        benefits: p.hero?.benefits?.length ? p.hero.benefits : [""],
        problems: p.problems ?? [],
        stages: p.stages ?? [],
        standards: p.standards ?? [],
        doctors: p.doctors ?? [],
        doctorRoles: p.doctorRoles ?? {},
        faq: p.faq ?? [],
      }
    : { ...EMPTY_SERVICE, hidden: row.hidden };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href="/admin/services"
        className="text-sm text-slate-500 hover:underline"
      >
        ← Усі послуги
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold tracking-tight">
        {p?.name ?? "Послуга"}
      </h1>
      <p className="mb-6 text-sm text-slate-500">/poslugy/{row.slug}</p>
      <ServiceForm
        mode="edit"
        id={row.id}
        slug={row.slug}
        initial={initial}
        availableDoctors={availableDoctors}
      />
    </main>
  );
}
