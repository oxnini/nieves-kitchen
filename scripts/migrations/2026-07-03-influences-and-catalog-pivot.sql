-- 2026-07-03: catalog pivot — influences, origin-less recipes, sunnah + featured-ingredient flags
-- Run on Supabase via SQL Editor (or MCP apply_migration). Idempotent: safe to re-run.
--
-- This migration:
--   1. Adds `influences` (world-atlas country names, plural) and backfills
--      it with array[country] for existing rows. `country` keeps its column
--      but is re-semanticized as the PRIMARY influence (the one that stamps).
--   2. Adds `is_sunnah` (dish-level prophetic flag) and
--      `featured_ingredients` (pantry-entry slugs, phase 2 consumer).
--   3. Relaxes `country`, `region`, `coordinates` to nullable so origin-less
--      recipes (no place at all) can exist. The recipes_region_check CHECK
--      passes on NULL, so it needs no change.
--   4. Relaxes `passport_stamps.recipe_country` to nullable so cooking an
--      origin-less recipe still logs a row (tier: new_recipe).

begin;

-- ── 1. influences ───────────────────────────────────────────────────
alter table public.recipes
  add column if not exists influences text[] not null default '{}';

update public.recipes
   set influences = array[country]
 where influences = '{}' and country is not null;

create index if not exists recipes_influences_idx
  on public.recipes using gin (influences);

-- ── 2. sunnah + featured ingredients ────────────────────────────────
alter table public.recipes
  add column if not exists is_sunnah boolean not null default false;

alter table public.recipes
  add column if not exists featured_ingredients text[] not null default '{}';

-- ── 3. origin-less recipes: place columns become nullable ──────────
-- DROP NOT NULL is a no-op when the column is already nullable.
alter table public.recipes alter column country drop not null;
alter table public.recipes alter column region drop not null;
alter table public.recipes alter column coordinates drop not null;

-- ── 4. stamps for origin-less cooks ─────────────────────────────────
alter table public.passport_stamps alter column recipe_country drop not null;

commit;
