import { clinic } from "@/lib/clinic-contact";
import { SITE_URL } from "@/lib/site-url";

/**
 * JSON-LD структуровані дані. Єдине джерело — clinic-contact.ts + SITE_URL.
 * Тип Dentist (успадковує LocalBusiness → MedicalBusiness) — рекомендований
 * Google для стоматології: дає машинно-читані адресу, графік, рейтинг.
 *
 * Координати — приблизний центр ж/м Тополя-1, Дніпро. Можна уточнити точними
 * з Google Maps пізніше (для видачі достатньо й адреси).
 */
const GEO = { latitude: 48.3936, longitude: 35.0192 };
const MAPS_URL = "https://maps.app.goo.gl/T6QnGrqqXjCfwm2p9";

/** Графік у форматі schema.org OpeningHoursSpecification. */
const openingHours = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "19:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "09:00",
    closes: "14:00",
  },
];

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "ж/м Тополя 1, буд. 15, кор. 5",
  addressLocality: "Дніпро",
  addressRegion: "Дніпропетровська область",
  postalCode: "49000",
  addressCountry: "UA",
};

/**
 * Головна Dentist-схема клініки. `@id` = канонічний URL сайту, щоб інші
 * сутності (лікарі, послуги) могли посилатися на цю організацію.
 */
export function clinicSchema(opts?: {
  rating?: { ratingValue: number; reviewCount: number };
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#clinic`,
    name: clinic.name,
    legalName: clinic.legalName,
    url: SITE_URL,
    image: `${SITE_URL}/images/og-default.jpg`,
    logo: `${SITE_URL}/images/dent-servis-logo.png`,
    telephone: clinic.phoneIntl,
    address: postalAddress,
    geo: { "@type": "GeoCoordinates", ...GEO },
    hasMap: MAPS_URL,
    openingHoursSpecification: openingHours,
    areaServed: { "@type": "City", name: "Дніпро" },
    priceRange: "₴₴",
    medicalSpecialty: "Dentistry",
  };

  if (opts?.rating && opts.rating.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: opts.rating.ratingValue,
      reviewCount: opts.rating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

/** Physician-схема для сторінки лікаря, прив'язана до клініки через worksFor. */
export function physicianSchema(doctor: {
  slug: string;
  fullName: string;
  position: string;
  specialty: string;
  photo: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE_URL}/likari/${doctor.slug}#physician`,
    name: doctor.fullName,
    jobTitle: doctor.position,
    medicalSpecialty: doctor.specialty,
    image: doctor.photo.startsWith("http")
      ? doctor.photo
      : `${SITE_URL}${doctor.photo}`,
    url: `${SITE_URL}/likari/${doctor.slug}`,
    worksFor: { "@type": "Dentist", "@id": `${SITE_URL}/#clinic`, name: clinic.name },
    address: postalAddress,
  };
}

/** MedicalProcedure-схема для сторінки послуги, прив'язана до клініки. */
export function serviceSchema(service: {
  slug: string;
  name: string;
  short: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.name,
    description: service.short,
    url: `${SITE_URL}/poslugy/${service.slug}`,
    procedureType: "https://schema.org/SurgicalProcedure",
    provider: { "@type": "Dentist", "@id": `${SITE_URL}/#clinic`, name: clinic.name },
  };
}

/** FAQPage-схема. Приймає масив питань/відповідей. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

/** Безпечна серіалізація JSON-LD у <script> (екранує </script>-ін'єкції). */
export function jsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
