import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

export const metadata: Metadata = {
  title: "Наші лікарі — Дент-Сервіс | Дніпро",
  description:
    "6 досвідчених стоматологів у Дніпрі: імплантологи, ортопеди, пародонтологи, ендодонти. 30+ років практики у клініки Дент-Сервіс.",
};

export default function LikariPage() {
  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="doctors-list.html" />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
