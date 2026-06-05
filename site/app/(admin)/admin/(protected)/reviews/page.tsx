import Link from "next/link";
import { listReviewsAdmin, reviewRowState } from "@/lib/admin/reviews-admin";
import ReviewsTable from "@/components/admin/ReviewsTable";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const rows = await listReviewsAdmin();
  const items = rows.map((r) => {
    const p = r.published ?? r.draft;
    return {
      id: r.id,
      slug: r.slug,
      author: p?.author ?? r.slug,
      avatar: p?.avatar ?? "",
      stars: p?.stars ?? 5,
      state: reviewRowState(r),
    };
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Відгуки</h1>
          <p className="text-sm text-slate-500">{items.length} відгуків</p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Додати відгук
        </Link>
      </div>
      <ReviewsTable items={items} />
    </main>
  );
}
