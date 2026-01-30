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
