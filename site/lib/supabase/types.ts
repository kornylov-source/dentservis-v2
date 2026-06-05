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
};
