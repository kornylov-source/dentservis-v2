// Главная страница — Этап 1.
// Порядок секций (обновлён 2026-04-27):
// Header → Hero → Trust → Послуги → Про медцентр → Доктори → Відгуки → CTA → Блог → Footer
// FAQ — на отдельной странице /faq (как в шаблоне Flossy), не на главной.

import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

export default function Page() {
  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="hero.html" />
      <HtmlSection file="trust-bar.html" />
      <HtmlSection file="services-three.html" />
      <HtmlSection file="about.html" />
      <HtmlSection file="doctors-carousel.html" />
      <HtmlSection file="testimonials-slider.html" />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="blog-carousel.html" />
      <HtmlSection file="footer.html" />

      {/* Клиентский компонент для перезапуска Webflow.js после React-гидратации */}
      <WebflowInit />
    </>
  );
}
