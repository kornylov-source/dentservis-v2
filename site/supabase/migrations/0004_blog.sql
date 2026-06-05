-- 0004_blog.sql
-- Статті блогу. Та сама модель draft/published (JSONB).
-- `category`, `author_slug`, `published_at` винесені в колонки для індексів і сортування
-- (стрічка блогу й категорії сортуються за датою, фільтруються за категорією).

create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  category      text not null default 'porady',
  author_slug   text,
  published_at  timestamptz,
  published     jsonb,
  draft         jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.blog_posts is 'Статті блогу. Публічна видимість = published IS NOT NULL. Payload містить content (HTML, санітизований на сервері), title, excerpt, seo, faq тощо.';

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_category_idx on public.blog_posts (category);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists blog_posts_visible_idx on public.blog_posts (published_at desc) where published is not null;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;
drop policy if exists "public can read published blog_posts" on public.blog_posts;
create policy "public can read published blog_posts"
  on public.blog_posts for select to anon, authenticated
  using (published is not null);
