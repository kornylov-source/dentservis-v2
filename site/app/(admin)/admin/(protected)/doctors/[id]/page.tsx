import Link from "next/link";
import { notFound } from "next/navigation";
import DoctorForm, {
  EMPTY_DOCTOR,
  type DoctorFormData,
} from "@/components/admin/DoctorForm";
import { getDoctorAdmin } from "@/lib/admin/doctors-admin";

export const dynamic = "force-dynamic";

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getDoctorAdmin(id);
  if (!row) notFound();

  const p = row.draft ?? row.published;
  const initial: DoctorFormData = p
    ? {
        fullName: p.fullName,
        shortName: p.shortName,
        position: p.position,
        experience: p.experience,
        specialty: p.specialty,
        photo: p.photoCard,
        cardSpecialty: p.cardSpecialty,
        cardExperienceList: p.cardExperienceList,
        cardExperienceCarousel: p.cardExperienceCarousel,
        bio: p.bio?.length ? p.bio : [""],
        highlights: p.highlights ?? [],
        training: p.training ?? [],
        expertise: p.expertise ?? "",
        quote: p.quote ?? "",
        hobby: p.hobby ?? "",
      }
    : EMPTY_DOCTOR;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href="/admin/doctors"
        className="text-sm text-slate-500 hover:underline"
      >
        ← Усі лікарі
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold tracking-tight">
        {p?.fullName ?? "Лікар"}
      </h1>
      <p className="mb-6 text-sm text-slate-500">/likari/{row.slug}</p>
      <DoctorForm mode="edit" id={row.id} slug={row.slug} initial={initial} />
    </main>
  );
}
