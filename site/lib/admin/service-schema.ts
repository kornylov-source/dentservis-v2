import { z } from "zod";

const Problem = z.object({
  title: z.string().trim().min(1, "Заголовок проблеми"),
  description: z.string().trim().min(1, "Опис проблеми"),
});
const Stage = z.object({
  number: z.string().trim().min(1),
  title: z.string().trim().min(1, "Назва етапу"),
  description: z.string().trim().min(1, "Опис етапу"),
});
const Faq = z.object({
  question: z.string().trim().min(1, "Питання"),
  answer: z.string().trim().min(1, "Відповідь"),
});

export const ICON_TYPES = [
  "implant",
  "orthopedic",
  "surgery",
  "therapy",
  "perio",
  "ortho",
  "esthetic",
  "hygiene",
] as const;

export const ICON_LABELS: Record<(typeof ICON_TYPES)[number], string> = {
  implant: "Імплантація",
  orthopedic: "Ортопедія",
  surgery: "Хірургія",
  therapy: "Терапія",
  perio: "Пародонтологія",
  ortho: "Ортодонтія",
  esthetic: "Естетика",
  hygiene: "Гігієна",
};

export const ServicePayloadSchema = z.object({
  name: z.string().trim().min(1, "Вкажіть назву послуги"),
  heroTitle: z.string().trim().nullish(),
  heroAccent: z.string().trim().nullish(),
  short: z.string().trim().min(1, "Вкажіть короткий опис"),
  iconType: z.enum(ICON_TYPES),
  image: z.string().trim().min(1, "Завантажте зображення послуги"),
  hero: z.object({
    headline: z.string().trim().min(1, "Заголовок hero"),
    intro: z.string().trim().min(1, "Вступний текст"),
    benefits: z.array(z.string().trim().min(1)).min(1, "Хоча б одна перевага"),
  }),
  problems: z.array(Problem),
  stages: z.array(Stage),
  doctors: z.array(z.string().trim().min(1)),
  doctorRoles: z.record(z.string(), z.string()).nullish(),
  standards: z.array(z.string().trim().min(1)),
  faq: z.array(Faq),
});

export type ServicePayloadInput = z.infer<typeof ServicePayloadSchema>;
