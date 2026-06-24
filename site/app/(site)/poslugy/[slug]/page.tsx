import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import ServiceDetail from "@/components/sections/ServiceDetail";
import {
  getServiceBySlug,
  getPublishedService,
  getAllServiceSlugs,
} from "@/lib/services";
import { SITE_URL } from "@/lib/site-url";
import { serviceSchema, faqSchema, jsonLd } from "@/lib/site-schema";

export async function generateStaticParams() {
  return getAllServiceSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedService(slug);

  if (!service) {
    return { title: "Послугу не знайдено — Дентсервіс" };
  }

  const url = `${SITE_URL}/poslugy/${slug}`;
  const title = `${service.name} у Дніпрі — Дентсервіс`;
  return {
    title,
    description: service.short,
    alternates: { canonical: url },
    openGraph: { title, description: service.short, url, type: "website" },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || service.hidden) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema(service)) }}
      />
      {service.faq && service.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(service.faq)) }}
        />
      )}
      <HtmlSection file="header.html" />
      <ServiceDetail service={service} />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
