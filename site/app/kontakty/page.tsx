import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

export const metadata: Metadata = {
  title: "Контакти — Дентсервіс | Дніпро",
  description:
    "Адреса: м. Дніпро, ж/м Тополя 1, буд. 15, кор. 5. Телефони: (050) 593-55-49, (068) 356-65-20. Графік роботи: ПН-ПТ 9:00-19:00, СБ 9:00-14:00. Записатись на консультацію.",
};

export default function KontaktyPage() {
  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="contact-banner.html" />
      <HtmlSection file="contact-section.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
