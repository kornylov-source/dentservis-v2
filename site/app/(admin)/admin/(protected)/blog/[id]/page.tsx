import Link from "next/link";
import { notFound } from "next/navigation";
import BlogForm, {
  EMPTY_BLOG,
  type BlogFormData,
} from "@/components/admin/BlogForm";
import { getBlogAdmin } from "@/lib/admin/blog-admin";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getBlogAdmin(id);
  if (!row) notFound();

  const p = row.draft ?? row.published;
  const initial: BlogFormData = p
    ? {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        authorSlug: p.authorSlug,
        publishedAt: p.publishedAt,
        updatedAt: p.updatedAt ?? "",
        featuredImage: p.featuredImage,
        imageAlt: p.imageAlt,
        readingTimeMin: p.readingTimeMin,
        metaTitle: p.seo?.metaTitle ?? "",
        metaDescription: p.seo?.metaDescription ?? "",
        keywords: p.seo?.keywords ?? [],
        faq: p.faq ?? [],
      }
    : EMPTY_BLOG;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/admin/blog" className="text-sm text-slate-500 hover:underline">
        ← Усі статті
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold tracking-tight">
        {p?.title ?? "Стаття"}
      </h1>
      <p className="mb-6 text-sm text-slate-500">/blog/{row.slug}</p>
      <BlogForm mode="edit" id={row.id} slug={row.slug} initial={initial} />
    </main>
  );
}
