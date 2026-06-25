import { z } from "zod";

/** Валідація payload групи FAQ (published/draft таблиці faq_groups). */
export const FaqGroupPayloadSchema = z.object({
  badge: z.string().trim().min(1, "Вкажіть номер групи (напр. 01)"),
  title: z.string().trim().min(1, "Вкажіть заголовок групи"),
});

export type FaqGroupPayloadInput = z.infer<typeof FaqGroupPayloadSchema>;

/** Валідація payload питання FAQ (published/draft таблиці faq_items). */
export const FaqItemPayloadSchema = z.object({
  question: z.string().trim().min(1, "Вкажіть питання"),
  answer: z.string().trim().min(1, "Вкажіть відповідь"),
});

export type FaqItemPayloadInput = z.infer<typeof FaqItemPayloadSchema>;
