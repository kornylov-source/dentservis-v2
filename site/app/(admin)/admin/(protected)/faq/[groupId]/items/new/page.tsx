import Link from "next/link";
import FaqItemForm from "@/components/admin/FaqItemForm";

export const dynamic = "force-dynamic";

export default async function NewFaqItemPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href={`/admin/faq/${groupId}`}
        className="text-sm text-slate-500 hover:underline"
      >
        ← До групи
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">Нове питання</h1>
      <FaqItemForm mode="new" groupId={groupId} />
    </main>
  );
}
