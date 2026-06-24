import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import ContactSection from "@/components/sections/ContactSection";
import { getClinicInfo } from "@/lib/data/clinic";

export const metadata: Metadata = {
  title: "Контакти — Дентсервіс | Дніпро",
  description:
    "Адреса: м. Дніпро, ж/м Тополя 1, буд. 15, кор. 5. Телефони: (050) 593-55-49, (068) 356-65-20. Графік роботи: ПН-ПТ 9:00-19:00, СБ 9:00-14:00. Записатись на консультацію.",
  alternates: { canonical: "/kontakty" },
};

export default async function KontaktyPage() {
  const clinic = await getClinicInfo();
  return (
    <>
      <HtmlSection file="header.html" />
      <HtmlSection file="contact-banner.html" />
      <ContactSection clinic={clinic} />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
