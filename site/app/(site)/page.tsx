// Главная страница — Этап 1.
// Порядок секций (обновлён 2026-04-27):
// Header → Hero → Trust → Послуги → Про медцентр → Доктори → Відгуки → CTA → Блог → Footer
// FAQ — на отдельной странице /faq (как в шаблоне Flossy), не на главной.

import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import DoctorsCarousel from "@/components/sections/DoctorsCarousel";
import TrustBar from "@/components/sections/TrustBar";
import ReviewsSlider from "@/components/sections/ReviewsSlider";
import { getDoctors } from "@/lib/data/doctors";
import { getTrustStats } from "@/lib/data/trust";
import { getReviews } from "@/lib/data/reviews";

export default async function Page() {
  const [doctors, trustStats, reviews] = await Promise.all([
    getDoctors(),
    getTrustStats(),
    getReviews(),
  ]);

  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="hero.html" />
      <TrustBar stats={trustStats} />
      <HtmlSection file="services-three.html" />
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
