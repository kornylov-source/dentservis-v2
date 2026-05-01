import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { services, getServiceBySlug } from "@/lib/services";

export function generateStaticParams() {
  return services.filter((s) => !s.hidden).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service || service.hidden) {
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
  const service = getServiceBySlug(slug);

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
