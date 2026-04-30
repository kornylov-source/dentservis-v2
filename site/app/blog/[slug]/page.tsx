import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import BlogPost from "@/components/sections/BlogPost";
import { getAllPosts, getPostBySlug, CATEGORY_META } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Статтю не знайдено — Дент-Сервіс" };
  }

  const url = `https://dent-servis.com.ua/blog/${post.slug}`;
  const ogImage = `https://dent-servis.com.ua${post.featuredImage}`;

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      images: [{ url: ogImage, width: 1200, height: 675, alt: post.imageAlt }],
      section: CATEGORY_META[post.category].name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <HtmlSection file="header.html" />
      <BlogPost post={post} />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
