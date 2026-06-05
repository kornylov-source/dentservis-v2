import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";

export const metadata: Metadata = {
  title: "Сторінку не знайдено — Дентсервіс",
  description:
    "Сторінку не знайдено. Поверніться на головну Дентсервіс або відкрийте розділи послуг, лікарів і контактів.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="notfound-section.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
