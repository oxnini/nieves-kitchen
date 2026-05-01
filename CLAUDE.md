# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js HMR)
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # Next.js ESLint
```

No test suite is configured.

Environment: copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (the service role key is only needed for the seed script).

## Architecture

**Nieves Kitchen** is a Next.js 15 (App Router) + TypeScript app for browsing global recipes on an interactive world map, backed by Supabase. Favorites persist in `localStorage`.

### Routing

App Router structure under `app/`:

| Route | File | Rendering |
|-------|------|-----------|
| `/` | `app/page.tsx` | Client — `WorldMap` + `FilterPanel` |
| `/recipes` | `app/recipes/page.tsx` | Client — card grid + `FilterPanel` |
| `/recipes/[slug]` | `app/recipes/[slug]/page.tsx` | Server — Supabase fetch, `generateMetadata` (SEO) |
| `/favorites` | `app/favorites/page.tsx` | Client — reads from `localStorage` |
| `/about` | `app/about/page.tsx` | Server — static |

Navigation is handled by `next/link`; active state uses `usePathname()` in `components/Navbar.tsx`.

### Data layer

All recipe data lives in Supabase in the `public.recipes` table. RLS is enabled with an anon-readable SELECT policy. The schema is defined in `scripts/schema.sql`.

- `lib/types.ts` — `Recipe`, `DbRecipe`, `Filters`, `CulinaryRegion`, plus `dbToRecipe()` which converts DB rows (snake_case) into the app's `Recipe` shape (camelCase).
- `lib/filters.ts` — `ALL_TAGS`, `DEFAULT_FILTERS`, `applyFilters`, `countActiveFilters`.
- `lib/regions.ts` — `COUNTRY_TO_REGION` (numeric ISO code → `CulinaryRegion`), `REGION_CENTERS`, `REGION_LABEL_POSITIONS`, choropleth color constants.
- `lib/supabase/server.ts` — async `createClient()` for Server Components (uses cookies).
- `lib/supabase/client.ts` — `createClient()` for the browser.
- `hooks/useRecipes.ts` — TanStack Query hook; fetches all recipes and maps via `dbToRecipe`.
- `hooks/useFavorites.ts` — `localStorage`-backed `Set<string>` under key `"nieves-favorites"`.

When adding a recipe, insert a row into the Supabase `recipes` table and ensure `country` matches the `properties.name` from `world-atlas` GeoJSON (used for choropleth coloring and country matching in `WorldMap`).

### Map (`components/WorldMap.tsx`)

Uses `react-simple-maps` with `world-atlas` GeoJSON fetched at runtime from a CDN. Two-level drill-down:
1. Click a region → zooms to region, shows country markers.
2. Click a country marker → shows a recipe sidebar panel; clicking a recipe navigates to `/recipes/[slug]` via `useRouter`.

Choropleth coloring blends from a light warm tone toward `CHOROPLETH_BASE` based on recipe density per region.

### Client vs Server Components

Everything in `components/` is a Client Component (`"use client"`) because it uses hooks, browser APIs, or interactive state. `app/recipes/[slug]/page.tsx` and `app/about/page.tsx` are Server Components. `app/layout.tsx` is a Server Component that renders the Client `Providers` (TanStack Query) and `Navbar`.

### Design tokens

Custom Tailwind v4 theme tokens are defined in `app/globals.css` under `@theme`:
- Colors: `parchment`, `terracotta`, `turmeric`, `paprika`, `sage`, `teal`, `brown-dark/medium/light`
- Fonts: `font-heading` (Literata), `font-body` (Figtree), `font-stamp` (Cutive), injected as CSS variables via `next/font/google` in `app/layout.tsx`.

Use these tokens (e.g. `bg-parchment`, `text-terracotta`) rather than raw hex values.

### Image guidelines

All static images in `public/` are WebP. When adding new images (wallpapers, stamps, icons, recipe photos that are bundled rather than remote), follow these rules:

1. **Format: WebP only.** Drop the source `.png`/`.jpg` into `public/`, then either run `npm run optimize-images` (converts everything in `public/`) or just `git commit` — a pre-commit hook auto-converts staged PNGs/JPGs that live inside the opt-in folders listed in `.husky/pre-commit` (currently `public/passport-bg/` and `public/stamps/`). To enable auto-conversion for a new folder, add it to `AUTO_CONVERT_DIRS` in that hook. PNGs in other locations (favicons, OG images, etc.) are left alone.
2. **Render with `next/image`, not CSS `background-image`.** CSS backgrounds bypass Next.js optimization and the browser's preload scanner. Use `<Image fill>` inside a `relative`-positioned parent for full-bleed backgrounds (see `components/passport/Spread.tsx`).
3. **Always set `sizes`.** This tells Next.js's image optimizer which width variants to generate. Without it, the browser downloads the largest variant. Match the actual rendered size, e.g. `sizes="(max-width: 640px) 100px, 140px"`.
4. **Use `priority` for above-the-fold images** (hero, first card, modal cover). Use `placeholder="blur"` with a `blurDataURL` for remote images that load progressively (see `components/RecipeCard.tsx`).
5. **Use `unoptimized` for tiny fixed-size icons** (under ~80 KB at the size they actually render). Going through `/_next/image` adds cold-start latency without producing a smaller variant. See the navbar icon in `components/passport/PassportAffordance.tsx`.
6. **Preload assets that live behind a click.** Anything inside a modal/overlay (passport booklet, dialog, etc.) is unknown to the browser until the user opens it, so it loads on-demand. For these, prefetch on `requestIdleCallback` and on `onPointerEnter` of the trigger — see the `prefetchUrls` pattern in `components/passport/PassportAffordance.tsx`. When you add a new wallpaper, add its path to `STATIC_PASSPORT_ASSETS` there. When you add a new custom country stamp, add it to `CUSTOM_STAMPS` in `lib/passport-stamps.ts` (the affordance reads this map automatically).

For raster source assets, prefer dimensions close to the largest size they'll render at — oversized sources waste bytes even after WebP conversion.

## Design Context

### Users
Curious home cooks who browse globally as much as they cook. They use Nieves Kitchen on weekends and evenings on a laptop or tablet, often in a relaxed "what should I explore tonight?" mindset. The job is part practical (find a recipe to make), part imaginative (travel through food, collect a culinary journey via the passport feature). Enthusiastic generalists who want to feel guided, inspired, and quietly proud of what they've tried.

### Brand Personality
**Three words:** warm, considered, well-traveled.

The voice is that of a thoughtful friend who has collected recipes from trips, tucks them into a linen-bound book, and writes short notes in the margins. Confident but never loud. Generous with context without turning into a blog essay. Editorial in craft, personal in voice.

Emotional goals: welcomed in (warm, inviting), taken seriously (considered, editorial), subtly accomplished as the passport fills up.

### Aesthetic Direction
A blend of three references, in descending weight:

1. **Printed cookbook / editorial** (primary) — large serif display type, generous margins, drop caps and pull quotes where they earn their place, room for photography to breathe. Confident headlines, quiet body text, intentional whitespace.
2. **Vintage passport & postal** (signature accents) — stamps, postmarks, ticket-stub perforations, ledger lines, embossed-looking seals, monospace date-stamps. Reserved for the passport feature and journey moments; NOT sprayed across the whole app.
3. **Modern Nordic restraint** (discipline layer) — clean grids under the warmth, generous negative space, a tight palette used intentionally, no ornament for its own sake. Prevents "cookbook + passport" from tipping into kitsch.

**Theme:** Two warm modes, no true dark mode.
- **Parchment** (light, default): `#FDF6EC` with terracotta/turmeric/sage/teal accents.
- **Sepia** (warm-dark): deep warm browns, cream text, gold/terracotta accents — leather-bound-book feel, not a tech dashboard.

**Anti-references** (explicitly NOT this):
- Not SaaS / dashboard: no card-grid monotony, no neutral grays, no productivity-app feel.
- Not food-delivery: no commerce UI, aggressive CTAs, or coupon-bright colors.
- Not rustic / kitsch: no chalkboard fonts, burlap textures, or country-kitchen energy.

### Design Principles
1. **Publication, not product.** Every screen is a magazine spread: typographic hierarchy first, whitespace respected, photography given room. Affordances are earned, not sprinkled.
2. **The passport is the soul.** Stamps and postal details are the signature visual language, but live inside the passport and journey moments. Scarcity is what makes them feel collectible.
3. **Warm restraint.** Warm palette, disciplined composition. 60-30-10 intentionality, tint neutrals toward the warm hue, never pure black/white.
4. **Typography does the heavy lifting.** A serif display face and refined body face handle hierarchy. No ornament to prop up weak typography. (Current pairing: Literata + Figtree, with Cutive for postal/stamp accents.)
5. **Delight at milestones, calm everywhere else.** Motion, confetti, and flourish are reserved for moments that matter (unlocking a region, earning a stamp, completing a journey). The rest of the app is quiet on purpose.
