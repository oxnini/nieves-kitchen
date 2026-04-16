create table if not exists public.recipes (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  country        text not null,
  region         text not null,
  description    text,
  ingredients    jsonb not null default '[]',
  steps          jsonb not null default '[]',
  tags           text[] not null default '{}',
  image_url      text,
  cook_time      int not null,
  prep_time      int not null,
  servings       int not null,
  difficulty     text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  category       text not null check (category in ('main', 'dessert', 'drink', 'side')),
  coordinates    jsonb not null,
  is_fusion      boolean not null default false,
  inspired_by    text[],
  quote          text not null,
  nutrition      jsonb not null,
  flavor_profile jsonb not null,
  created_at     timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "Public can read recipes"
  on public.recipes
  for select
  to anon
  using (true);
