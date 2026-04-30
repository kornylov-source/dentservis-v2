import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import BlogList from "@/components/sections/BlogList";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  BlogCategory,
  getPostsByCategory,
} from "@/lib/blog";

export function generateStaticParams() {
  return CATEGORY_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_META[slug as BlogCategory];

  if (!cat) {
    return { title: "Категорію не знайдено — Дент-Сервіс" };
  }

  const url = `https://dent-servis.com.ua/blog/category/${slug}`;

  return {
    title: `${cat.name} — статті блогу Дент-Сервіс | Дніпро`,
    description: cat.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.name} — блог Дент-Сервіс`,
      description: cat.description,
      url,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = slug as BlogCategory;
  const cat = CATEGORY_META[category];

  if (!cat) {
    notFound();
  }

  const posts = getPostsByCategory(category);

  return (
    <>
      <HtmlSection file="header.html" />

      <section className="page-banner-section">
        <div className="w-layout-blockcontainer container w-container">
          <div className="page-banner-contents">
            <ul role="list" className="breadcrumbs-list">
              <li className="breadcrumbs-item">
                <a href="/" className="caption text-white">Головна</a>
              </li>
              <li>
                <div className="icon w-embed">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z" fill="#f6f6f6"/>
                  </svg>
                </div>
              </li>
              <li className="breadcrumbs-item">
                <a href="/blog" className="caption text-white">Блог</a>
              </li>
              <li>
                <div className="icon w-embed">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.68172 15.5025C6.53922 15.5025 6.39672 15.45 6.28422 15.3375C6.06672 15.12 6.06672 14.76 6.28422 14.5425L11.1742 9.65251C11.5342 9.29251 11.5342 8.70751 11.1742 8.34751L6.28422 3.45751C6.06672 3.24001 6.06672 2.88001 6.28422 2.66251C6.50172 2.44501 6.86172 2.44501 7.07922 2.66251L11.9692 7.55251C12.3517 7.93501 12.5692 8.45252 12.5692 9.00002C12.5692 9.54751 12.3592 10.065 11.9692 10.4475L7.07922 15.3375C6.96672 15.4425 6.82422 15.5025 6.68172 15.5025Z" fill="#f6f6f6"/>
                  </svg>
                </div>
              </li>
              <li className="breadcrumbs-item">
                <a href={`/blog/category/${category}`} aria-current="page" className="caption text-white w--current">
                  {cat.shortName}
                </a>
              </li>
            </ul>
            <h1 className="text-center text-white">{cat.name}</h1>
            <p className="paragraph-no-margin text-center text-white" style={{ maxWidth: "720px", marginTop: "1rem", opacity: 0.9 }}>
              {cat.description}
            </p>
          </div>
        </div>
      </section>

      <BlogList posts={posts} initialCategory={category} />

      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
