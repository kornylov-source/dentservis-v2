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

  return {
    title: `${service.name} у Дніпрі — Дентсервіс`,
    description: service.short,
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
      <HtmlSection file="header.html" />
      <ServiceDetail service={service} />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
