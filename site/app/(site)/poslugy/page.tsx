import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import ServicesCatalog from "@/components/sections/ServicesCatalog";

export const metadata: Metadata = {
  title: "Послуги — Дентсервіс | Дніпро",
  description:
    "Повний спектр стоматологічних послуг у Дніпрі: імплантація, ортопедія, хірургія, терапія, пародонтологія, естетична стоматологія, гігієна. Цифровий протокол, гарантія.",
};

export default function PoslugyPage() {
  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="poslugy-banner.html" />
      <ServicesCatalog />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
