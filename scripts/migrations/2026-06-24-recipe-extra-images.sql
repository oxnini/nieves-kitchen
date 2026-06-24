-- 2026-06-24-recipe-extra-images.sql
--
-- Adds an `images` jsonb array to public.recipes for the recipe-detail
-- extra-images gallery (photos beyond the hero). Each element is
-- { url, caption?, width, height }. The hero stays in `image_url`, untouched.
--
-- Idempotent: safe to re-run. Existing rows default to an empty array.

alter table public.recipes
  add column if not exists images jsonb not null default '[]';
