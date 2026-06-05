import { z } from "zod";

/** Валідація payload цифри trust-bar (published/draft таблиці trust_stats). */
export const TrustStatPayloadSchema = z.object({
  number: z.string().trim().min(1, "Вкажіть число (напр. 20 000+)"),
  label: z.string().trim().min(1, "Вкажіть підпис"),
});

export type TrustStatPayloadInput = z.infer<typeof TrustStatPayloadSchema>;
