import Link from "next/link";
import ServiceForm from "@/components/admin/ServiceForm";
import { getPublishedDoctors } from "@/lib/data/doctors";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  const doctors = await getPublishedDoctors();
  const availableDoctors = doctors.map((d) => ({
    slug: d.slug,
    name: d.fullName,
  }));

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href="/admin/services"
        className="text-sm text-slate-500 hover:underline"
      >
        ← Усі послуги
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        Нова послуга
      </h1>
      <ServiceForm mode="new" availableDoctors={availableDoctors} />
    </main>
  );
}
