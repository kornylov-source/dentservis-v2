import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

export const metadata: Metadata = {
  title: "Часті питання — Дент-Сервіс | Дніпро",
  description:
    "Відповіді на найпоширеніші запитання про лікування у Дент-Сервіс: цифровий протокол, імплантація, гарантії, оплата, графік роботи. Дніпро.",
};

export default function FaqPage() {
  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="faq-banner.html" />
      <HtmlSection file="faq-page.html" />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
