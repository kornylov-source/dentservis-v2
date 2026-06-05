import Link from "next/link";
import ReviewForm from "@/components/admin/ReviewForm";

export const dynamic = "force-dynamic";

export default function NewReviewPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href="/admin/reviews"
        className="text-sm text-slate-500 hover:underline"
      >
        ← Усі відгуки
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        Новий відгук
      </h1>
      <ReviewForm mode="new" />
    </main>
  );
}
