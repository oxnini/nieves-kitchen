# Nieves' Kitchen

> Globally inspired halal recipes, organised on a world map and collected in a culinary passport.

Nieves' Kitchen is a small, slow-built site for browsing recipes the way you'd flip through a well-travelled cookbook. The home page is an interactive world map: zoom into a region, click a country, and see what's been cooked there. As you make a recipe, you can stamp it into a passport — a simple ledger of where your kitchen has been. Every dish is halal, personally tested, and weighted toward home cooks who care about both flavour and protein. The map is the table of contents; the passport is the souvenir.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Supabase (Postgres + RLS + anonymous auth)
- TanStack Query, react-simple-maps, Framer Motion

## Getting started

```bash
git clone https://github.com/oxnini/nieves-kitchen.git
cd nieves-kitchen
npm install --legacy-peer-deps
cp .env.local.example .env.local   # fill in Supabase keys
npm run dev
```

The `SUPABASE_SERVICE_ROLE_KEY` is only needed if you want to run `npm run seed:mock`. The app itself uses the anon key.

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server with HMR. |
| `npm run build` | Build the production bundle. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run Next.js ESLint. |
| `npm run seed:mock` | Seed Supabase from `lib/mock-recipes.ts` (requires `SUPABASE_SERVICE_ROLE_KEY`). |
| `npm run optimize-images` | Convert all PNG/JPG assets in `public/` to WebP. |

A Husky pre-commit hook also auto-converts staged PNG/JPG files inside the opt-in folders listed in `.husky/pre-commit` (currently `public/passport-bg/` and `public/stamps/`).

## Project structure

```
app/         Next.js App Router routes, layouts, and the @modal parallel slot
components/  Client components (map, recipe cards, passport booklet, navbar)
hooks/       TanStack Query hooks, favorites, cooked stamps, theme, etc.
lib/         Types, filters, regions, Supabase clients, passport content
scripts/     Database schema and one-off seeding/optimisation scripts
public/      Static assets (recipe photos, stamps, wallpapers — all WebP)
```

## Database

Two tables, both behind Postgres row-level security: `recipes` (anon-readable) and `passport_stamps` (scoped to the authenticated anonymous user via `auth.uid()`). The schema lives in `scripts/schema.sql`.

## Security

Found a security issue? See [SECURITY.md](./SECURITY.md).

## License

License: TBD
