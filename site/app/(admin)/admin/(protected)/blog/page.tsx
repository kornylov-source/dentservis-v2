import Link from "next/link";
import { listBlogAdmin, blogRowState } from "@/lib/admin/blog-admin";
import BlogTable from "@/components/admin/BlogTable";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const rows = await listBlogAdmin();
  const items = rows.map((r) => {
    const p = r.published ?? r.draft;
    return {
      id: r.id,
      slug: r.slug,
      title: p?.title ?? r.slug,
      image: p?.featuredImage ?? "",
      category: p?.category ?? r.category,
      date: (r.published_at ?? p?.publishedAt ?? "").slice(0, 10),
      state: blogRowState(r),
    };
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Блог</h1>
          <p className="text-sm text-slate-500">{items.length} статей</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Додати статтю
        </Link>
      </div>
      <BlogTable items={items} />
    </main>
  );
}
