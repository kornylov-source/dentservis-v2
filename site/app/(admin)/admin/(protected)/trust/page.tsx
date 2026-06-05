import Link from "next/link";
import { listTrustAdmin, trustRowState } from "@/lib/admin/trust-admin";
import TrustTable from "@/components/admin/TrustTable";

export const dynamic = "force-dynamic";

export default async function TrustAdminPage() {
  const rows = await listTrustAdmin();
  const items = rows.map((r) => {
    const p = r.published ?? r.draft;
    return {
      id: r.id,
      slug: r.slug,
      number: p?.number ?? "",
      label: p?.label ?? "",
      state: trustRowState(r),
    };
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Цифри (trust-bar)
          </h1>
          <p className="text-sm text-slate-500">{items.length} показників</p>
        </div>
        <Link
          href="/admin/trust/new"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Додати показник
        </Link>
      </div>
      <TrustTable items={items} />
    </main>
  );
}
