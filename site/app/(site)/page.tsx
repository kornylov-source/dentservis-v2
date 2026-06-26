// Главная страница — Этап 1.
// Порядок секций (обновлён 2026-04-27):
// Header → Hero → Trust → Послуги → Про медцентр → Доктори → Відгуки → CTA → Блог → Footer
// FAQ — на отдельной странице /faq (как в шаблоне Flossy), не на главной.

import type { Metadata } from "next";

import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import DoctorsCarousel from "@/components/sections/DoctorsCarousel";
import ServicesThree from "@/components/sections/ServicesThree";
import TrustBar from "@/components/sections/TrustBar";
import ReviewsSlider from "@/components/sections/ReviewsSlider";
import { getDoctors } from "@/lib/data/doctors";
import { getTrustStats } from "@/lib/data/trust";
import { getReviews } from "@/lib/data/reviews";
import { clinicSchema, jsonLd } from "@/lib/site-schema";

export const metadata: Metadata = {
  title: "Стоматологія у Дніпрі — імплантація, протезування | Дентсервіс",
  description:
    "Стоматологічна клініка Дентсервіс у Дніпрі: імплантація зубів (MegaGen, All-on-4/6), протезування, естетика, лікування. Цифровий протокол, 30+ років практики, гарантія.",
  alternates: { canonical: "/" },
};

export default async function Page() {
  const [doctors, trustStats, reviews] = await Promise.all([
    getDoctors(),
    getTrustStats(),
    getReviews(),
  ]);

  // Агрегований рейтинг із реальних відгуків для Dentist-схеми.
  const rating =
    reviews.length > 0
      ? {
          ratingValue:
            Math.round(
              (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length) * 10,
            ) / 10,
          reviewCount: reviews.length,
        }
      : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(clinicSchema({ rating })) }}
      />
      <HtmlSection file="header.html" />
      <HtmlSection file="hero.html" />
      <TrustBar stats={trustStats} />
      <ServicesThree />
      <HtmlSection file="about.html" />
      <DoctorsCarousel doctors={doctors} />
      <ReviewsSlider reviews={reviews} />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="blog-carousel.html" />
      <HtmlSection file="footer.html" />

      {/* Клиентский компонент для перезапуска Webflow.js после React-гидратации */}
      <WebflowInit />
    </>
  );
}
