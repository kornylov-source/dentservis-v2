import Link from "next/link";
import { listDoctorsAdmin, rowState } from "@/lib/admin/doctors-admin";
import DoctorsTable from "@/components/admin/DoctorsTable";

export const dynamic = "force-dynamic";

export default async function DoctorsAdminPage() {
  const rows = await listDoctorsAdmin();
  const items = rows.map((r) => {
    const p = r.published ?? r.draft;
    return {
      id: r.id,
      slug: r.slug,
      name: p?.fullName ?? r.slug,
      photo: p?.photoCard ?? "",
      state: rowState(r),
    };
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Лікарі</h1>
          <p className="text-sm text-slate-500">{items.length} лікарів</p>
        </div>
        <Link
          href="/admin/doctors/new"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Додати лікаря
        </Link>
      </div>
      <DoctorsTable items={items} />
    </main>
  );
}
