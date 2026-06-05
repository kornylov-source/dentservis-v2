/**
 * Сід 6 лікарів у таблицю doctors.
 * Запуск (з папки site):  node --env-file=.env.local supabase/seed-doctors.ts
 * Ідемпотентний (upsert by slug) — можна ганяти повторно.
 *
 * Дані беремо з джерела правди lib/data/doctors.ts (важкі bio/training/тощо),
 * а короткий текст карток — зі сниппетів doctors-list.html / doctors-carousel.html.
 */
import { createClient } from "@supabase/supabase-js";
import { doctors } from "../lib/data/doctors.ts";

// Текст карток (cardSpecialty однаковий у списку й каруселі; experience відрізняється).
const cardCopy: Record<
  string,
  { cardSpecialty: string; cardExperienceList: string; cardExperienceCarousel: string }
> = {
  zhmakov: {
    cardSpecialty: "Засновник, хірург-імплантолог, ортопед",
    cardExperienceList: "30+ років практики. Імплантація, складна хірургія, протезування.",
    cardExperienceCarousel: "30+ років практики",
  },
  avilov: {
    cardSpecialty: "Лікар-стоматолог, хірург, ортопед",
    cardExperienceList: "40 років досвіду. Хірургія, протезування, відновлення зубного ряду.",
    cardExperienceCarousel: "40 років досвіду, хірургія, протезування",
  },
  chala: {
    cardSpecialty: "Терапевт, пародонтолог",
    cardExperienceList: "Лікування ясен, кюретаж, пластика рецесій, відбілювання.",
    cardExperienceCarousel: "Лікування ясен, кюретаж, відбілювання",
  },
  oskoma: {
    cardSpecialty: "Терапевт, провідний ендодонт",
    cardExperienceList: "21 рік досвіду. Лікування каналів, складні випадки, ретреатмент.",
    cardExperienceCarousel: "21 рік досвіду, лікування каналів",
  },
  klassina: {
    cardSpecialty: "Терапевт",
    cardExperienceList: "20 років досвіду. Терапія, реставрація, робота з тривожними пацієнтами.",
    cardExperienceCarousel: "20 років досвіду, терапія, реставрація",
  },
  shcherbakov: {
    cardSpecialty: "Імплантолог, ортопед, естетика",
    cardExperienceList: "Імплантація, тотальні реабілітації, естетична реставрація.",
    cardExperienceCarousel: "Імплантація, тотальні реабілітації",
  },
};

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env.local)");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const rows = doctors.map((d, i) => {
  const c = cardCopy[d.slug];
  if (!c) throw new Error(`No card copy for slug "${d.slug}"`);
  const payload = {
    fullName: d.fullName,
    shortName: d.shortName,
    position: d.position,
    experience: d.experience,
    specialty: d.specialty,
    // Поки що картка й детальна використовують одне фото; після фотосесії Олена завантажить кропи 4:5 / 1:1.
    photoCard: d.photo,
    photoDetail: d.photo,
    cardSpecialty: c.cardSpecialty,
    cardExperienceList: c.cardExperienceList,
    cardExperienceCarousel: c.cardExperienceCarousel,
    bio: d.bio,
    highlights: d.highlights ?? null,
    training: d.training ?? null,
    expertise: d.expertise ?? null,
    quote: d.quote ?? null,
    hobby: d.hobby ?? null,
  };
  return {
    slug: d.slug,
    status: "published",
    sort_order: i,
    published: payload,
    draft: null,
  };
});

const { error } = await supabase.from("doctors").upsert(rows, { onConflict: "slug" });
if (error) {
  console.error("SEED ERROR:", error);
  process.exit(1);
}

const { count, error: countErr } = await supabase
  .from("doctors")
  .select("*", { count: "exact", head: true });
if (countErr) {
  console.error("COUNT ERROR:", countErr);
  process.exit(1);
}

console.log(`Seeded ${rows.length} doctors. Total rows in table: ${count}`);
