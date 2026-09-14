-- ─────────────────────────────────────────────────────────────────────────────
-- Affiliate referral tracking
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.partner_visits (
  id           uuid primary key default gen_random_uuid(),
  partner_code text        not null,
  visitor_id   text        not null,
  landing_path text,
  referrer     text,
  created_at   timestamptz not null default now()
);

create index if not exists partner_visits_code_time_idx
  on public.partner_visits (partner_code, created_at desc);

alter table public.partner_visits enable row level security;

-- Visitors arriving on the referral link write their own visit row.
create policy "anon can log a visit"
  on public.partner_visits
  for insert
  to anon
  with check (true);

-- The admin dashboard reads the counts with the same public key.
create policy "anon can read visits"
  on public.partner_visits
  for select
  to anon
  using (true);
