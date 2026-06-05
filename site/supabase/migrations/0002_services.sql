-- 0002_services.sql
-- Послуги клініки. Та сама модель draft/published (JSONB), що й у doctors.
-- `hidden` — окрема колонка (а не лише в payload), бо за нею фільтрується
-- видимість у каталозі та generateStaticParams (ortodontiia зараз hidden=true).

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  integer not null default 0,
  hidden      boolean not null default false,
  published   jsonb,
  draft       jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.services is 'Послуги клініки. Публічна видимість = published IS NOT NULL AND NOT hidden.';

create index if not exists services_status_sort_idx on public.services (status, sort_order);
create index if not exists services_visible_idx on public.services (sort_order) where published is not null and hidden = false;

-- updated_at-тригер (функція public.set_updated_at уже створена в 0001).
drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- RLS: anon/authenticated читають лише опубліковані й не приховані.
alter table public.services enable row level security;

drop policy if exists "public can read visible services" on public.services;
create policy "public can read visible services"
  on public.services
  for select
  to anon, authenticated
  using (published is not null and hidden = false);
