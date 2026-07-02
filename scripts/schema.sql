create table if not exists public.recipes (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text unique not null,
  title                 text not null,
  country               text,
  region                text,
  description           text,
  attribution           text,
  ingredients           jsonb not null default '[]',
  steps                 jsonb not null default '[]',
  tags                  text[] not null default '{}',
  image_url             text,
  images                jsonb not null default '[]',
  time_active           int not null,
  time_total            int not null,
  time_resting          int,
  yield                 text,
  equipment             text[],
  is_vegetarian         boolean not null default false,
  is_vegan              boolean not null default false,
  is_gluten_free        boolean not null default false,
  is_dairy_free         boolean not null default false,
  servings              int not null,
  difficulty            text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  category              text not null check (category in ('main', 'dessert', 'drink', 'side')),
  coordinates           jsonb,
  is_fusion             boolean not null default false,
  inspired_by           text[],
  quote                 text not null,
  nutrition             jsonb not null,
  flavor_profile        jsonb not null,
  headnote_ingredients  text,
  headnote_instructions text,
  tips                  text[],
  substitutions         text[],
  variations            text[],
  storage               text,
  dropcap               boolean not null default false,
  influences            text[] not null default '{}',
  is_sunnah             boolean not null default false,
  featured_ingredients  text[] not null default '{}',
  created_at            timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "Public can read recipes"
  on public.recipes
  for select
  to anon, authenticated
  using (true);

create table if not exists public.passport_stamps (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  recipe_slug    text not null,
  recipe_country text,
  cooked_at      timestamptz not null default now()
);

create index if not exists passport_stamps_user_idx
  on public.passport_stamps(user_id);

create index if not exists passport_stamps_user_country_idx
  on public.passport_stamps(user_id, recipe_country);

alter table public.passport_stamps enable row level security;

create policy "stamps_select_own"
  on public.passport_stamps
  for select
  using (auth.uid() = user_id);

create policy "stamps_insert_own"
  on public.passport_stamps
  for insert
  with check (auth.uid() = user_id);

create policy "stamps_delete_own"
  on public.passport_stamps
  for delete
  using (auth.uid() = user_id);
