import { z } from "zod";

const BlogFaqSchema = z.object({
  question: z.string().trim().min(1, "Вкажіть питання"),
  answer: z.string().trim().min(1, "Вкажіть відповідь"),
});

const CATEGORIES = [
  "implantatsiia",
  "estetyka",
  "terapiia",
  "parodontolohiia",
  "khirurhiia",
  "porady",
] as const;

/** Валідація payload статті блогу (published/draft таблиці blog_posts). */
export const BlogPostPayloadSchema = z.object({
  title: z.string().trim().min(1, "Вкажіть заголовок"),
  excerpt: z.string().trim().min(1, "Вкажіть короткий опис (превʼю)"),
  content: z.string().min(1, "Тіло статті не може бути порожнім"),
  category: z.enum(CATEGORIES, { message: "Оберіть категорію" }),
  authorSlug: z.string().trim().min(1, "Оберіть автора"),
  publishedAt: z.string().trim().min(1, "Вкажіть дату публікації"),
  updatedAt: z.string().trim().optional(),
  featuredImage: z.string().trim().min(1, "Завантажте головне зображення"),
  imageAlt: z.string().trim().min(1, "Вкажіть alt зображення (для SEO)"),
  readingTimeMin: z.coerce.number().int().min(1),
  seo: z.object({
    metaTitle: z.string().trim().min(1, "Вкажіть SEO-заголовок"),
    metaDescription: z.string().trim().min(1, "Вкажіть SEO-опис"),
    keywords: z.array(z.string().trim().min(1)),
  }),
  faq: z.array(BlogFaqSchema).optional(),
});

export type BlogPostPayloadInput = z.infer<typeof BlogPostPayloadSchema>;

export { CATEGORIES };
