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
