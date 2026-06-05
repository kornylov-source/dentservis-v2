/**
 * Чисті (НЕ server-only) частини блогу: типи, константи категорій, форматери.
 * Можуть імпортуватись і в клієнтських компонентах (BlogList), і в серверних.
 * Серверний data-fetching — у lib/blog.ts (той реекспортує звідси для зворотної сумісності).
 */

export type BlogCategory =
  | "implantatsiia"
  | "estetyka"
  | "terapiia"
  | "parodontolohiia"
  | "khirurhiia"
  | "porady";

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  authorSlug: string;
  publishedAt: string;
  updatedAt?: string;
  featuredImage: string;
  imageAlt: string;
  readingTimeMin: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  faq?: BlogFaq[];
};

export const CATEGORY_META: Record<
  BlogCategory,
  { name: string; shortName: string; description: string }
> = {
  implantatsiia: {
    name: "Імплантація та цифровий протокол",
    shortName: "Імплантація",
    description:
      "Дентальна імплантація MegaGen, All-on-4, синус-ліфтинг, цифровий протокол із 3D-плануванням.",
  },
  estetyka: {
    name: "Естетична стоматологія",
    shortName: "Естетика",
    description:
      "Керамічні вініри, відбілювання Opalescence, художня реставрація — для природньої та довговічної посмішки.",
  },
  terapiia: {
    name: "Терапія та ендодонтія",
    shortName: "Терапія",
    description:
      "Лікування карієсу, кореневих каналів, складна реставрація зубів.",
  },
  parodontolohiia: {
    name: "Пародонтологія",
    shortName: "Пародонтологія",
    description:
      "Лікування ясен, пародонтиту та гінгівіту, професійна гігієна Air Flow.",
  },
  khirurhiia: {
    name: "Хірургія",
    shortName: "Хірургія",
    description:
      "Видалення зубів, кісткова пластика, апікоектомія — складна стоматологічна хірургія.",
  },
  porady: {
    name: "Поради та профілактика",
    shortName: "Поради",
    description:
      "Як обрати клініку, профілактика, догляд за зубами вдома, відповіді на типові запитання.",
  },
};

export const CATEGORY_ORDER: BlogCategory[] = [
  "implantatsiia",
  "estetyka",
  "terapiia",
  "parodontolohiia",
  "khirurhiia",
  "porady",
];

export function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDateUk(iso: string): string {
  const months = [
    "січня",
    "лютого",
    "березня",
    "квітня",
    "травня",
    "червня",
    "липня",
    "серпня",
    "вересня",
    "жовтня",
    "листопада",
    "грудня",
  ];
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
