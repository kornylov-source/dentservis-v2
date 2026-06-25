import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import FaqSection from "@/components/sections/FaqSection";
import { getFaq } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "Часті питання — Дентсервіс | Дніпро",
  description:
    "Відповіді на найпоширеніші запитання про лікування у Дентсервіс: цифровий протокол, імплантація, гарантії, оплата, графік роботи. Дніпро.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const groups = await getFaq();

  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="faq-banner.html" />
      <FaqSection groups={groups} />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
