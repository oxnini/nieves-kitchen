-- Numbered recipe notes (RecipeTin Eats style footnotes).
-- Ingredients point to a note with `"note": N` inside the existing ingredients
-- jsonb, so only the notes list itself needs a column. Idempotent.
alter table public.recipes add column if not exists notes text[];
