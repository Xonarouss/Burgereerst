-- Run in Supabase SQL editor
create table if not exists petition_signatures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  verified boolean not null default false,

  full_name text not null,
  city text not null,

  email text not null,
  email_hash text not null unique,

  consent_privacy boolean not null default false,

  verify_token_hash text,
  ip_hash text,
  user_agent text
);

create index if not exists petition_signatures_verified_idx on petition_signatures(verified, created_at desc);

-- Optional: restrict public reads; we only read count from server using service role key anyway.

-- ---------------------------------------------------------------------
-- BLOG / CMS
-- ---------------------------------------------------------------------
-- Create a storage bucket named 'blog-images' (or set BLOG_STORAGE_BUCKET)
-- and make it PUBLIC so OG images work.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  published boolean not null default false,
  locale text not null default 'nl',
  slug text not null,
  title text not null,
  excerpt text,
  author text,
  cover_image_url text,
  cover_image_path text,
  cover_image_caption text,
  cover_image_credit text,
  content_md text not null default '',
  tags text[]
);

create unique index if not exists blog_posts_locale_slug_key on public.blog_posts (locale, slug);
create index if not exists blog_posts_published_idx on public.blog_posts (published, published_at desc);

-- Ensure new columns exist (safe to run multiple times)
alter table if exists public.blog_posts
  add column if not exists cover_image_caption text,
  add column if not exists cover_image_credit text;


-- Rate limiting (DB-backed, works across instances)
create table if not exists public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0,
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);


-- ---------------------------------------------------------------------
-- BLOG NOTIFICATIONS
-- ---------------------------------------------------------------------
create table if not exists public.blog_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  active boolean not null default false,
  locale text not null default 'nl',
  email text not null,
  email_hash text not null unique,
  confirm_token_hash text
);


-- Allow unsubscribe tracking
alter table if exists public.blog_subscribers add column if not exists unsubscribed_at timestamptz;
create index if not exists blog_subscribers_active_idx on public.blog_subscribers(active, locale, created_at desc);

create table if not exists public.blog_push_subscriptions (
  endpoint_hash text primary key,
  endpoint text not null,
  locale text not null default 'nl',
  subscription jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_push_subscriptions_active_idx on public.blog_push_subscriptions(active, locale, created_at desc);
