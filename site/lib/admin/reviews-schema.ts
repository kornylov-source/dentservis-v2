import { z } from "zod";

/** Валідація payload відгуку (published/draft таблиці reviews). */
export const ReviewPayloadSchema = z.object({
  author: z.string().trim().min(1, "Вкажіть ім'я автора"),
  text: z.string().trim().min(1, "Вкажіть текст відгуку"),
  avatar: z.string().trim().min(1, "Завантажте фото або вкажіть шлях"),
  stars: z.coerce.number().int().min(1).max(5),
});

export type ReviewPayloadInput = z.infer<typeof ReviewPayloadSchema>;
