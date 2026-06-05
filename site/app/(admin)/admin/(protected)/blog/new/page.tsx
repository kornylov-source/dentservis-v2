import Link from "next/link";
import BlogForm from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default function NewBlogPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/admin/blog" className="text-sm text-slate-500 hover:underline">
        ← Усі статті
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold tracking-tight">
        Нова стаття
      </h1>
      <BlogForm mode="new" />
    </main>
  );
}
