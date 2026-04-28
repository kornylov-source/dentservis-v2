import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

export const metadata: Metadata = {
  title: "Про нас — Дент-Сервіс | Дніпро",
  description:
    "Дент-Сервіс — медичний центр у Дніпрі з 2003 року. Цифровий протокол лікування: 3D-сканування, КТ, Digital Smile Design. 6 лікарів, 20+ років досвіду, доказова медицина.",
};

export default function ProNasPage() {
  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="about-banner.html" />
      <HtmlSection file="about-main.html" />
      <HtmlSection file="about-protocol.html" />
      <HtmlSection file="about-standards.html" />
      <HtmlSection file="about-history.html" />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
