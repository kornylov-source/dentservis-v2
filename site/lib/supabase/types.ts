/** JSONB payload лікаря (зберігається в колонках published / draft таблиці doctors). */
export type DoctorPayload = {
  fullName: string;
  shortName: string;
  position: string;
  experience: string;
  specialty: string;
  photoCard: string; // фото картки (4:5)
  photoDetail: string; // фото детальної сторінки (1:1)
  cardSpecialty: string;
  cardExperienceList: string;
  cardExperienceCarousel: string;
  bio: string[];
  highlights?: { title: string; description: string }[] | null;
  training?: string[] | null;
  expertise?: string | null;
  quote?: string | null;
  hobby?: string | null;
};

export type DoctorRow = {
  slug: string;
  sort_order: number;
  status: string;
  published: DoctorPayload | null;
  draft: DoctorPayload | null;
};

/** JSONB payload відгуку (таблиця reviews). */
export type ReviewPayload = {
  author: string;
  text: string;
  avatar: string;
  stars: number;
};

/** JSONB payload цифри trust-bar (таблиця trust_stats). */
export type TrustStatPayload = {
  number: string;
  label: string;
};

/** JSONB payload статті блогу (таблиця blog_posts). */
export type BlogPostPayload = {
  title: string;
  excerpt: string;
  content: string; // HTML, санітизований на сервері перед збереженням
  category: string;
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
  faq?: { question: string; answer: string }[];
};

/** JSONB payload контактів клініки (singleton-таблиця clinic_info). */
export type ClinicPayload = {
  name: string;
  legalName: string;
  city: string;
  address: string;
  phone: string;
  phoneIntl: string;
  phone2: string;
  phone2Intl: string;
  schedule: { weekdays: string; saturday: string; sunday: string };
  scheduleShort: string;
  parking: string;
  website: string;
  contactsUrl: string;
  mapsUrl: string;
  telegram?: string;
  viberPhone?: string;
};

/** JSONB payload групи FAQ (таблиця faq_groups). */
export type FaqGroupPayload = {
  badge: string; // напр. «01»
  title: string; // напр. «Загальні питання» — останнє слово виділяється у рендері
};

export type FaqGroupRow = {
  id: string;
  sort_order: number;
  status: string;
  published: FaqGroupPayload | null;
  draft: FaqGroupPayload | null;
};

/** JSONB payload питання FAQ (таблиця faq_items). */
export type FaqItemPayload = {
  question: string;
  answer: string;
};

export type FaqItemRow = {
  id: string;
  group_id: string;
  sort_order: number;
  status: string;
  published: FaqItemPayload | null;
  draft: FaqItemPayload | null;
};
