import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewForm, {
  EMPTY_REVIEW,
  type ReviewFormData,
} from "@/components/admin/ReviewForm";
import { getReviewAdmin } from "@/lib/admin/reviews-admin";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getReviewAdmin(id);
  if (!row) notFound();

  const p = row.draft ?? row.published;
  const initial: ReviewFormData = p
    ? {
        author: p.author,
        text: p.text,
        avatar: p.avatar,
        stars: p.stars,
      }
    : EMPTY_REVIEW;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href="/admin/reviews"
        className="text-sm text-slate-500 hover:underline"
      >
        ← Усі відгуки
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        {p?.author ?? "Відгук"}
      </h1>
      <ReviewForm mode="edit" id={row.id} slug={row.slug} initial={initial} />
    </main>
  );
}
