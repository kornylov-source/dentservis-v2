import Link from "next/link";
import { notFound } from "next/navigation";
import FaqItemForm, {
  EMPTY_ITEM,
  type FaqItemFormData,
} from "@/components/admin/FaqItemForm";
import { getFaqItemAdmin } from "@/lib/admin/faq-admin";

export const dynamic = "force-dynamic";

export default async function EditFaqItemPage({
  params,
}: {
  params: Promise<{ groupId: string; id: string }>;
}) {
  const { groupId, id } = await params;
  const row = await getFaqItemAdmin(id);
  if (!row) notFound();

  const p = row.draft ?? row.published;
  const initial: FaqItemFormData = p
    ? { question: p.question, answer: p.answer }
    : EMPTY_ITEM;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href={`/admin/faq/${groupId}`}
        className="text-sm text-slate-500 hover:underline"
      >
        ← До групи
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        {p?.question ?? "Питання"}
      </h1>
      <FaqItemForm mode="edit" groupId={groupId} id={row.id} initial={initial} />
    </main>
  );
}
