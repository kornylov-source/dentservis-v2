import Link from "next/link";
import { notFound } from "next/navigation";
import FaqGroupForm, {
  EMPTY_GROUP,
  type FaqGroupFormData,
} from "@/components/admin/FaqGroupForm";
import FaqItemsTable from "@/components/admin/FaqItemsTable";
import {
  getFaqGroupAdmin,
  listFaqItemsAdmin,
  faqItemState,
} from "@/lib/admin/faq-admin";

export const dynamic = "force-dynamic";

export default async function EditFaqGroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const group = await getFaqGroupAdmin(groupId);
  if (!group) notFound();

  const gp = group.draft ?? group.published;
  const initial: FaqGroupFormData = gp
    ? { badge: gp.badge, title: gp.title }
    : EMPTY_GROUP;

  const itemRows = await listFaqItemsAdmin(groupId);
  const items = itemRows.map((r) => {
    const p = r.published ?? r.draft;
    return {
      id: r.id,
      question: p?.question ?? "(без питання)",
      state: faqItemState(r),
    };
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/admin/faq" className="text-sm text-slate-500 hover:underline">
        ← Усі групи
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        {gp?.title ?? "Група"}
      </h1>

      <FaqGroupForm mode="edit" id={group.id} initial={initial} />

      <div className="mb-4 mt-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Питання в групі ({items.length})
        </h2>
        <Link
          href={`/admin/faq/${groupId}/items/new`}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Додати питання
        </Link>
      </div>
      <FaqItemsTable groupId={groupId} items={items} />
    </main>
  );
}
