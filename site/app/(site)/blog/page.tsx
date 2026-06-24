import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import BlogList from "@/components/sections/BlogList";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Блог Дентсервіс — статті про сучасну стоматологію | Дніпро",
  description:
    "Корисні статті від лікарів Дентсервіс: імплантація, естетика, лікування ясен, профілактика. Експертний контент без академічної мови.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Блог Дентсервіс — статті про сучасну стоматологію",
    description:
      "Корисні статті від лікарів клініки. Імплантація, естетика, ендодонтія, пародонтологія, профілактика.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="blog-banner.html" />
      <BlogList posts={posts} />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
