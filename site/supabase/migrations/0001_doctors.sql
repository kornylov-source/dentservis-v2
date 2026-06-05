-- 0001_doctors.sql
-- Етап 1: таблиця лікарів для кастомної адмінки Дент-Сервіс.
-- Модель draft/published: публічний сайт читає `published`, адмінка редагує `draft`,
-- «Опублікувати» копіює draft -> published. Глибоко вкладений контент лежить у JSONB.
--
-- Застосувати один раз у новому Supabase-проекті Дент-Сервіс (НЕ в Kornify).
-- Сід 6 лікарів робиться окремим скриптом (читає поточний lib/data/doctors.ts
-- + текст карток зі сниппетів) — не в цій міграції.

-- gen_random_uuid() доступний у Supabase out-of-the-box (pgcrypto).

create table if not exists public.doctors (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  integer not null default 0,
  published   jsonb,          -- повний опублікований payload або NULL (NULL = не показувати на сайті)
  draft       jsonb,          -- незбережені/неопубліковані зміни або NULL
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.doctors is 'Лікарі клініки. Джерело правди публічної видимості = published IS NOT NULL.';
comment on column public.doctors.published is 'Опублікований payload (DoctorPayload). NULL = ще не опубліковано.';
comment on column public.doctors.draft is 'Чернетка/незбережені зміни. Preview читає coalesce(draft, published).';

-- Порядок карток у списку/каруселі та фільтр публічних
create index if not exists doctors_status_sort_idx on public.doctors (status, sort_order);
create index if not exists doctors_published_idx on public.doctors (sort_order) where published is not null;

-- updated_at автоматично
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists doctors_set_updated_at on public.doctors;
create trigger doctors_set_updated_at
  before update on public.doctors
  for each row execute function public.set_updated_at();

-- RLS: anon/authenticated можуть лише ЧИТАТИ опубліковане (defense-in-depth).
-- Жодних insert/update/delete-політик => записи лише через service_role у Server Actions.
alter table public.doctors enable row level security;

drop policy if exists "public can read published doctors" on public.doctors;
create policy "public can read published doctors"
  on public.doctors
  for select
  to anon, authenticated
  using (published is not null);
