import Link from "next/link";
import { listServicesAdmin, svcRowState } from "@/lib/admin/services-admin";
import ServicesTable from "@/components/admin/ServicesTable";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const rows = await listServicesAdmin();
  const items = rows.map((r) => {
    const p = r.published ?? r.draft;
    return {
      id: r.id,
      slug: r.slug,
      name: p?.name ?? r.slug,
      image: p?.image ?? "",
      hidden: r.hidden,
      state: svcRowState(r),
    };
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Послуги</h1>
          <p className="text-sm text-slate-500">{items.length} послуг</p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Додати послугу
        </Link>
      </div>
      <ServicesTable items={items} />
    </main>
  );
}
