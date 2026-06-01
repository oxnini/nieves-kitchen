-- 2026-05-31: enforce region whitelist, make image_url NOT NULL, add lookup indexes
-- Run on Supabase via SQL Editor (or psql). Idempotent: safe to re-run.
--
-- This migration:
--   1. Adds a CHECK constraint on `recipes.region` restricting it to the 11
--      values of the `CulinaryRegion` TypeScript union in `lib/types.ts`.
--   2. Backfills NULL `image_url` to '' and enforces NOT NULL with a default.
--   3. Adds B-tree indexes on `recipes.region` and `recipes.country` for
--      common filter queries.
--
-- !!! PREFLIGHT WARNING !!!
-- Step (1) will fail if any existing row has a `region` value outside the
-- whitelist. Run the SELECT in section 1.a FIRST and fix any offending rows
-- (UPDATE the row, or correct the spelling) before re-running this migration.

begin;

-- ── 1. CHECK constraint on recipes.region ──────────────────────────
-- 1.a Preflight: list any rows that would violate the constraint.
--     This is a SELECT only — it does not modify data. If it returns any
--     rows, STOP and fix those rows before continuing. Re-run the migration
--     after the offending values are corrected.
do $$
declare
  bad_count int;
begin
  select count(*) into bad_count
    from public.recipes
   where region not in (
     'Western Europe',
     'Eastern Europe',
     'East Asia',
     'Southeast Asia',
     'South Asia',
     'Middle East',
     'North Africa',
     'Sub-Saharan Africa',
     'North America',
     'South America',
     'Oceania'
   );
  if bad_count > 0 then
    raise exception
      'Cannot add recipes_region_check: % row(s) have a region outside the whitelist. Run `SELECT DISTINCT region FROM public.recipes WHERE region NOT IN (...);` to find them, then fix and re-run.',
      bad_count;
  end if;
end $$;

-- 1.b Add the CHECK constraint. Postgres has no `ADD CONSTRAINT IF NOT EXISTS`,
--     so wrap in a DO block that swallows duplicate_object on re-run.
do $$
begin
  alter table public.recipes
    add constraint recipes_region_check
    check (region in (
      'Western Europe',
      'Eastern Europe',
      'East Asia',
      'Southeast Asia',
      'South Asia',
      'Middle East',
      'North Africa',
      'Sub-Saharan Africa',
      'North America',
      'South America',
      'Oceania'
    ));
exception
  when duplicate_object then null;
end $$;

-- ── 2. image_url: default '', backfill NULLs, then NOT NULL ────────
-- Order matters: set the default first so subsequent INSERTs without
-- image_url get '' rather than NULL, then backfill existing NULLs, then
-- enforce NOT NULL. Each statement is safe to re-run.

alter table public.recipes
  alter column image_url set default '';

update public.recipes
   set image_url = ''
 where image_url is null;

alter table public.recipes
  alter column image_url set not null;

-- ── 3. Indexes for common filter queries ──────────────────────────
create index if not exists recipes_region_idx
  on public.recipes (region);

create index if not exists recipes_country_idx
  on public.recipes (country);

commit;
