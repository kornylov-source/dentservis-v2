-- 0003_reviews_trust_clinic.sql
-- Три сутності блоку «соціальний доказ + контакти»:
--   reviews     — відгуки пацієнтів (слайдер на головній), draft/published як у doctors/services.
--   trust_stats — цифри trust-bar (4 пари «число + підпис»), draft/published.
--   clinic_info — SINGLETON: одна строка з контактами клініки. Її читають І сайт, І AI-бот
--                 (єдине джерело правди — закриває ризик «клієнт змінив телефон, бот диктує старий»).

-- ─────────────────────────────────────────────────────────────────────────────
-- reviews
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  integer not null default 0,
  published   jsonb,
  draft       jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.reviews is 'Відгуки пацієнтів. Публічна видимість = published IS NOT NULL. Payload: {author, text, avatar, stars}.';

create index if not exists reviews_status_sort_idx on public.reviews (status, sort_order);
create index if not exists reviews_visible_idx on public.reviews (sort_order) where published is not null;

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;
drop policy if exists "public can read published reviews" on public.reviews;
create policy "public can read published reviews"
  on public.reviews for select to anon, authenticated
  using (published is not null);

-- ─────────────────────────────────────────────────────────────────────────────
-- trust_stats
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.trust_stats (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  integer not null default 0,
  published   jsonb,
  draft       jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.trust_stats is 'Цифри trust-bar. Payload: {number, label}.';

create index if not exists trust_stats_status_sort_idx on public.trust_stats (status, sort_order);
create index if not exists trust_stats_visible_idx on public.trust_stats (sort_order) where published is not null;

drop trigger if exists trust_stats_set_updated_at on public.trust_stats;
create trigger trust_stats_set_updated_at
  before update on public.trust_stats
  for each row execute function public.set_updated_at();

alter table public.trust_stats enable row level security;
drop policy if exists "public can read published trust_stats" on public.trust_stats;
create policy "public can read published trust_stats"
  on public.trust_stats for select to anon, authenticated
  using (published is not null);

-- ─────────────────────────────────────────────────────────────────────────────
-- clinic_info  (SINGLETON — рівно одна строка, id фіксований)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.clinic_info (
  id          text primary key default 'singleton' check (id = 'singleton'),
  published   jsonb,
  draft       jsonb,
  updated_at  timestamptz not null default now()
);

comment on table public.clinic_info is 'Контакти клініки (singleton). Читають сайт І AI-бот. Payload: {name, legalName, city, address, phone, phoneIntl, phone2, phone2Intl, schedule{weekdays,saturday,sunday}, scheduleShort, parking, website, contactsUrl}.';

drop trigger if exists clinic_info_set_updated_at on public.clinic_info;
create trigger clinic_info_set_updated_at
  before update on public.clinic_info
  for each row execute function public.set_updated_at();

alter table public.clinic_info enable row level security;
drop policy if exists "public can read clinic_info" on public.clinic_info;
create policy "public can read clinic_info"
  on public.clinic_info for select to anon, authenticated
  using (published is not null);
