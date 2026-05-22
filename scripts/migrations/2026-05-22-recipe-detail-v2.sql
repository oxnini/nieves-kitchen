-- 2026-05-22: recipe-detail v2 schema
-- Run on Supabase via SQL Editor. Idempotent: safe to re-run.
--
-- Adds new editorial fields (description already exists; equipment, attribution,
-- variations, dietary booleans, dropcap, headnotes), splits prep/cook time into
-- active/total/resting, and converts ingredients + steps from flat arrays to
-- grouped arrays of the shape:
--   ingredients: [{ heading?: string, items: Ingredient[] }, ...]
--   steps:       [{ heading?: string, headnote?: string, items: string[] }, ...]

begin;

-- ── 1. Add new columns (idempotent) ────────────────────────────────
alter table public.recipes
  add column if not exists attribution           text,
  add column if not exists time_active           int,
  add column if not exists time_total            int,
  add column if not exists time_resting          int,
  add column if not exists yield                 text,
  add column if not exists equipment             text[],
  add column if not exists is_vegetarian         boolean not null default false,
  add column if not exists is_vegan              boolean not null default false,
  add column if not exists is_gluten_free        boolean not null default false,
  add column if not exists is_dairy_free         boolean not null default false,
  add column if not exists headnote_ingredients  text,
  add column if not exists headnote_instructions text,
  add column if not exists variations            text[],
  add column if not exists dropcap               boolean not null default false;

-- `description` already exists on the base schema, so we leave it alone.

-- ── 2. Backfill time fields from prep_time / cook_time ─────────────
-- Only backfill where the new columns are still NULL so re-running this
-- migration on a partially-applied DB doesn't overwrite manual edits.
update public.recipes
   set time_active = coalesce(time_active, prep_time),
       time_total  = coalesce(time_total,  prep_time + cook_time),
       time_resting = coalesce(time_resting, 0)
 where time_active is null
    or time_total  is null
    or time_resting is null;

-- ── 3. Enforce NOT NULL on the two required time fields ────────────
alter table public.recipes
  alter column time_active set not null,
  alter column time_total  set not null;

-- ── 4. Convert ingredients jsonb to grouped shape ──────────────────
-- Wrap a flat `Ingredient[]` into `[{ items: Ingredient[] }]`.
-- Guard: only convert when the current top-level array contains plain
-- ingredient objects (i.e. the first element is an object that does NOT
-- already have an `items` key). This prevents double-wrapping if the
-- migration is re-run.
update public.recipes
   set ingredients = jsonb_build_array(jsonb_build_object('items', ingredients))
 where jsonb_typeof(ingredients) = 'array'
   and jsonb_array_length(ingredients) > 0
   and jsonb_typeof(ingredients->0) = 'object'
   and not (ingredients->0 ? 'items');

-- Rows whose ingredients array is empty also need wrapping (single empty group)
-- so all rows have a consistent shape post-migration.
update public.recipes
   set ingredients = jsonb_build_array(jsonb_build_object('items', '[]'::jsonb))
 where jsonb_typeof(ingredients) = 'array'
   and jsonb_array_length(ingredients) = 0;

-- ── 5. Convert steps jsonb to grouped shape ────────────────────────
-- Wrap a flat `string[]` into `[{ items: string[] }]`.
-- Guard: top-level array, first element is a string (flat shape). After
-- conversion the first element will be an object, so this is safe to re-run.
update public.recipes
   set steps = jsonb_build_array(jsonb_build_object('items', steps))
 where jsonb_typeof(steps) = 'array'
   and jsonb_array_length(steps) > 0
   and jsonb_typeof(steps->0) = 'string';

update public.recipes
   set steps = jsonb_build_array(jsonb_build_object('items', '[]'::jsonb))
 where jsonb_typeof(steps) = 'array'
   and jsonb_array_length(steps) = 0;

-- ── 6. Drop the now-replaced prep_time / cook_time columns ─────────
alter table public.recipes
  drop column if exists prep_time,
  drop column if exists cook_time;

commit;
