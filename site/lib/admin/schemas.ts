import { z } from "zod";

const Highlight = z.object({
  title: z.string().trim().min(1, "Вкажіть заголовок"),
  description: z.string().trim().min(1, "Вкажіть опис"),
});

/** Валідація payload лікаря (те, що зберігається в published/draft). */
export const DoctorPayloadSchema = z.object({
  fullName: z.string().trim().min(1, "Вкажіть повне ім'я"),
  shortName: z.string().trim().min(1, "Вкажіть скорочене ім'я"),
  position: z.string().trim().min(1, "Вкажіть посаду"),
  experience: z.string().trim().min(1, "Вкажіть досвід"),
  specialty: z.string().trim().min(1, "Вкажіть спеціалізацію"),
  photoCard: z.string().trim().min(1, "Завантажте фото лікаря"),
  photoDetail: z.string().trim().min(1, "Завантажте фото лікаря"),
  cardSpecialty: z.string().trim().min(1, "Вкажіть підпис у картці"),
  cardExperienceList: z.string().trim().min(1, "Вкажіть рядок досвіду (список)"),
  cardExperienceCarousel: z
    .string()
    .trim()
    .min(1, "Вкажіть рядок досвіду (карусель)"),
  bio: z
    .array(z.string().trim().min(1))
    .min(1, "Додайте хоча б один абзац біографії"),
  highlights: z.array(Highlight).nullish(),
  training: z.array(z.string().trim().min(1)).nullish(),
  expertise: z.string().trim().nullish(),
  quote: z.string().trim().nullish(),
  hobby: z.string().trim().nullish(),
});

export type DoctorPayloadInput = z.infer<typeof DoctorPayloadSchema>;

export const SlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, "Тільки маленькі латинські літери, цифри та дефіс");

/** Перетворює помилки Zod на { поле: повідомлення } для форми. */
export function flattenZodError(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
