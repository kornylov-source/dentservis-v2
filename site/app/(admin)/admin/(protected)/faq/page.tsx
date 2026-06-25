import Link from "next/link";
import {
  listFaqGroupsAdmin,
  listFaqItemsAdmin,
  faqGroupState,
} from "@/lib/admin/faq-admin";
import FaqGroupsTable from "@/components/admin/FaqGroupsTable";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const groups = await listFaqGroupsAdmin();
  const items = await Promise.all(
    groups.map(async (g) => {
      const p = g.published ?? g.draft;
      const groupItems = await listFaqItemsAdmin(g.id);
      return {
        id: g.id,
        badge: p?.badge ?? "—",
        title: p?.title ?? "(без назви)",
        itemsCount: groupItems.length,
        state: faqGroupState(g),
      };
    }),
  );

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/admin" className="text-sm text-slate-500 hover:underline">
        ← На головну адмінки
      </Link>
      <div className="mb-6 mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Часті питання</h1>
          <p className="text-sm text-slate-500">
            {items.length} груп. Питання редагуються всередині групи.
          </p>
        </div>
        <Link
          href="/admin/faq/new"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Додати групу
        </Link>
      </div>
      <FaqGroupsTable items={items} />
    </main>
  );
}
