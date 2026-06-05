import type { MetadataRoute } from "next";
import { getAllPosts, CATEGORY_ORDER } from "@/lib/blog";
import { getPublishedServices } from "@/lib/services";
import { getPublishedDoctors } from "@/lib/data/doctors";

const SITE = "https://dent-servis.com.ua";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split("T")[0];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: today, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/pro-nas`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/poslugy`, lastModified: today, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/likari`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/kontakty`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/faq`, lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: today, changeFrequency: "weekly", priority: 0.9 },
  ];

  const serviceList = await getPublishedServices();
  const servicePages: MetadataRoute.Sitemap = serviceList.map((s) => ({
    url: `${SITE}/poslugy/${s.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const doctorList = await getPublishedDoctors();
  const doctorPages: MetadataRoute.Sitemap = doctorList.map((d) => ({
    url: `${SITE}/likari/${d.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: p.updatedAt || p.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogCategories: MetadataRoute.Sitemap = CATEGORY_ORDER.map((slug) => ({
    url: `${SITE}/blog/category/${slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...doctorPages,
    ...blogPosts,
    ...blogCategories,
  ];
}
