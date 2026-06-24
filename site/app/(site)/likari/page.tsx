import type { Metadata } from "next";
import HtmlSection from "@/components/HtmlSection";
import WebflowInit from "@/components/WebflowInit";
import DoctorsList from "@/components/sections/DoctorsList";
import { getDoctors } from "@/lib/data/doctors";

export const metadata: Metadata = {
  title: "Наші лікарі — Дентсервіс | Дніпро",
  description:
    "6 досвідчених стоматологів у Дніпрі: імплантологи, ортопеди, пародонтологи, ендодонти. 30+ років практики у клініки Дентсервіс.",
  alternates: { canonical: "/likari" },
};

export default async function LikariPage() {
  const doctors = await getDoctors();

  return (
    <>
      <HtmlSection file="header.html" />
      <DoctorsList doctors={doctors} />
      <HtmlSection file="cta-offer.html" />
      <HtmlSection file="footer.html" />

      <WebflowInit />
    </>
  );
}
