import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import DoctorDetail from "@/components/sections/DoctorDetail";
import { getDoctor, getPublishedDoctor, getAllDoctorSlugs } from "@/lib/data/doctors";

export async function generateStaticParams() {
  return getAllDoctorSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getPublishedDoctor(slug);

  if (!doctor) {
    return { title: "Лікар не знайдений — Дентсервіс" };
  }

  return {
    title: `${doctor.fullName} — ${doctor.position} | Дентсервіс`,
    description: `${doctor.fullName} — ${doctor.position}. ${doctor.experience}. Запис на прийом у Дніпрі.`,
  };
}

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctor(slug);

  if (!doctor) {
    notFound();
  }

  return (
    <>
      <HtmlSection file="header.html" />
      <DoctorDetail doctor={doctor} />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
