import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import BlogList from "@/components/sections/BlogList";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Блог Дентсервіс — статті про сучасну стоматологію | Дніпро",
  description:
    "Корисні статті від лікарів Дентсервіс: імплантація, естетика, лікування ясен, профілактика. Експертний контент без академічної мови.",
  alternates: {
    canonical: "https://dent-servis.com.ua/blog",
  },
  openGraph: {
    title: "Блог Дентсервіс — статті про сучасну стоматологію",
    description:
      "Корисні статті від лікарів клініки. Імплантація, естетика, ендодонтія, пародонтологія, профілактика.",
    url: "https://dent-servis.com.ua/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

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
