import { z } from "zod";

/** Валідація payload контактів клініки (published/draft singleton-таблиці clinic_info). */
export const ClinicPayloadSchema = z.object({
  name: z.string().trim().min(1, "Вкажіть назву"),
  legalName: z.string().trim().min(1, "Вкажіть юридичну назву"),
  city: z.string().trim().min(1, "Вкажіть місто"),
  address: z.string().trim().min(1, "Вкажіть адресу"),
  phone: z.string().trim().min(1, "Вкажіть основний телефон"),
  phoneIntl: z
    .string()
    .trim()
    .regex(/^\+\d{6,15}$/, "Формат: +380XXXXXXXXX"),
  phone2: z.string().trim().min(1, "Вкажіть другий телефон"),
  phone2Intl: z
    .string()
    .trim()
    .regex(/^\+\d{6,15}$/, "Формат: +380XXXXXXXXX"),
  schedule: z.object({
    weekdays: z.string().trim().min(1, "Вкажіть графік пн-пт"),
    saturday: z.string().trim().min(1, "Вкажіть графік суботи"),
    sunday: z.string().trim().min(1, "Вкажіть неділю"),
  }),
  scheduleShort: z.string().trim().min(1, "Вкажіть короткий графік"),
  parking: z.string().trim().min(1, "Вкажіть інфо про парковку"),
  website: z.string().trim().min(1, "Вкажіть сайт"),
  contactsUrl: z.string().trim().min(1, "Вкажіть URL сторінки контактів"),
  mapsUrl: z.string().trim().min(1, "Вкажіть посилання на Google Maps"),
});

export type ClinicPayloadInput = z.infer<typeof ClinicPayloadSchema>;
