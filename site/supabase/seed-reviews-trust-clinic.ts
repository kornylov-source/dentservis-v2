/**
 * Сід відгуків, trust-bar і контактів клініки.
 * Запуск (з папки site):  node --env-file=.env.local supabase/seed-reviews-trust-clinic.ts
 * Ідемпотентний (upsert by slug / fixed id). Джерела:
 *   reviews     ← lib/snippets/testimonials-slider.html (5 відгуків)
 *   trust_stats ← lib/snippets/trust-bar.html (4 цифри)
 *   clinic_info ← lib/clinic-contact.ts (singleton)
 */
import { createClient } from "@supabase/supabase-js";
import { clinic } from "../lib/clinic-contact.ts";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// ── reviews ──────────────────────────────────────────────────────────────────
const reviews = [
  {
    slug: "starodubets",
    author: "Сергій Стародубець",
    avatar: "/images/user-2.webp",
    stars: 5,
    text: "Мені пролікували канали і відновили зуби у «Дентсервісі», після відмови у двох інших клініках, де мене переконували видалити ці зуби. Велика подяка лікарям Жмакову Олександру Анатолійовичу та Оскоминій Олені Анатоліївні. Щиро дякую вам і всьому доброзичливому колективу «Дентсервіс».",
  },
  {
    slug: "tyshchenko",
    author: "Анастасія Тищенко",
    avatar: "/images/user-1.webp",
    stars: 5,
    text: "Звернулася до вашої клініки за рекомендацією. Робила професійну чистку зубів — настільки якісної та акуратної чистки мені ще ніколи не робили. Лікар — Анна Леонідівна. Усе дуже ретельно та комфортно. Після процедури — відчуття ідеальної чистоти без болю та дискомфорту. Також у цій клініці видаляла зуб мудрості в іншого лікаря — Олександра Анатолійовича. Усе пройшло ідеально: швидко, професійно, спокійно, без ускладнень. Щиро рекомендую цю клініку!",
  },
  {
    slug: "lyashkov",
    author: "Євген Ляшков",
    avatar: "/images/user-4.webp",
    stars: 5,
    text: "Робив пластику (перекриття рецесії). Процедура не з приємних, але не така страшна, якою може здаватися. Раджу не затягувати з лікуванням, бо від цього залежить ваше здоров’я. Загоєння трохи виснажуюче, але якщо дотримуватись усіх рекомендацій, то воно буде відбуватись швидше. Результатом задоволений. Дуже вам дякую!",
  },
  {
    slug: "kolyada",
    author: "Наталія Коляда",
    avatar: "/images/user-3.webp",
    stars: 5,
    text: "Дуже вдячна колективу «Дентсервіс». Особливо Олександру Анатолійовичу, у якого робила імплантацію. На мій страх, усе пройшло безболісно, швидко та професійно. Я і надалі буду продовжувати лікування в цьому колективі. Дуже вам вдячна.",
  },
  {
    slug: "bila",
    author: "Ганна Біла",
    avatar: "/images/user-5.webp",
    stars: 5,
    text: "Хочеться поділитись гарними враженнями від лікування зубів у «Дентсервіс». Починаючи з адміністратора — гарної та приємної дівчини, яка завжди підбере зручний час та нагадає про прийом. А також окремо хочу висловити найщиріші слова подяки лікарю Оксані Миколаївні! Дякую за високий професіоналізм та чуйність!",
  },
];

const reviewRows = reviews.map((r, i) => {
  const { slug, ...payload } = r;
  return { slug, status: "published", sort_order: i, published: payload, draft: null };
});

// ── trust_stats ──────────────────────────────────────────────────────────────
const trust = [
  { slug: "patients", number: "20 000+", label: "пацієнтів з 2003 року" },
  { slug: "oldest", number: "85", label: "вік найстаршої пацієнтки з імплантацією" },
  { slug: "doctors", number: "6", label: "досвідчених лікарів" },
  { slug: "license", number: "МОЗ", label: "офіційна ліцензія" },
];

const trustRows = trust.map((t, i) => {
  const { slug, ...payload } = t;
  return { slug, status: "published", sort_order: i, published: payload, draft: null };
});

// ── clinic_info (singleton) ──────────────────────────────────────────────────
const clinicRow = {
  id: "singleton",
  published: {
    name: clinic.name,
    legalName: clinic.legalName,
    city: clinic.city,
    address: clinic.address,
    phone: clinic.phone,
    phoneIntl: clinic.phoneIntl,
    phone2: clinic.phone2,
    phone2Intl: clinic.phone2Intl,
    schedule: clinic.schedule,
    scheduleShort: clinic.scheduleShort,
    parking: clinic.parking,
    website: clinic.website,
    contactsUrl: clinic.contactsUrl,
    mapsUrl: "https://maps.app.goo.gl/T6QnGrqqXjCfwm2p9",
  },
  draft: null,
};

// ── upserts ──────────────────────────────────────────────────────────────────
let err =
  (await supabase.from("reviews").upsert(reviewRows, { onConflict: "slug" })).error ||
  (await supabase.from("trust_stats").upsert(trustRows, { onConflict: "slug" })).error ||
  (await supabase.from("clinic_info").upsert(clinicRow, { onConflict: "id" })).error;

if (err) {
  console.error("SEED ERROR:", err);
  process.exit(1);
}

console.log(
  `Seeded ${reviewRows.length} reviews, ${trustRows.length} trust stats, 1 clinic_info singleton.`
);
