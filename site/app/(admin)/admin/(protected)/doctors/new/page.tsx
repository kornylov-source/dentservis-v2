import Link from "next/link";
import DoctorForm from "@/components/admin/DoctorForm";

export default function NewDoctorPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href="/admin/doctors"
        className="text-sm text-slate-500 hover:underline"
      >
        ← Усі лікарі
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        Новий лікар
      </h1>
      <DoctorForm mode="new" />
    </main>
  );
}
