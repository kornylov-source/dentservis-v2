import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

export const metadata: Metadata = {
  title: "Часті питання — Дентсервіс | Дніпро",
  description:
    "Відповіді на найпоширеніші запитання про лікування у Дентсервіс: цифровий протокол, імплантація, гарантії, оплата, графік роботи. Дніпро.",
  alternates: { canonical: "/faq" },
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
