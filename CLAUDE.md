# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server (Next.js HMR)
npm run build            # Production build
npm run start            # Serve production build
npm run lint             # Next.js ESLint
npm run seed:mock        # Seed Supabase from lib/mock-recipes.ts (needs SERVICE_ROLE_KEY)
npm run optimize-images  # Convert all PNG/JPG in public/ to WebP
```

No test suite is configured. `husky` is wired via the `prepare` script — installs a pre-commit hook that auto-converts staged PNG/JPG → WebP for files inside `AUTO_CONVERT_DIRS` (`.husky/pre-commit`).

Environment: copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (service role only needed for `seed:mock`). `NEXT_PUBLIC_USE_MOCK_DATA=true` swaps the recipe source for `lib/mock-recipes.ts` (dev only).

## Architecture

**Nieves Kitchen** is a Next.js 15 (App Router) + React 19 + TypeScript app for browsing global recipes on an interactive world map, backed by Supabase. Favorites persist in `localStorage`; cooked-recipe "stamps" persist in Supabase against an anonymous user session.

Key dependencies: `@tanstack/react-query`, `@supabase/ssr`, `react-simple-maps`, `framer-motion`, `canvas-confetti`, `recharts`, `rc-slider`, `lucide-react`, Tailwind v4.

### Routing

App Router structure under `app/`. The root layout uses a **parallel `@modal` slot** so recipe detail pages can render as overlays on top of the current view without losing the map/list behind them.

| Route | File | Rendering |
|-------|------|-----------|
| `/` | `app/page.tsx` | Client — `WorldMap` + `MapSearch` + `FilterPanel` |
| `/recipes` | `app/recipes/page.tsx` | Client — card grid + `FilterPanel` |
| `/recipes/[slug]` | `app/recipes/[slug]/page.tsx` | Server — Supabase fetch via cached `getRecipe()`, `generateMetadata` (SEO) |
| `/favorites` | `app/favorites/page.tsx` | Client — reads from `localStorage` |
| `/about` | `app/about/page.tsx` | Server — static |
| `/passport` | `app/passport/page.tsx` | Client — standalone `PassportBooklet` route (rarely hit; in-app the overlay is preferred) |
| `@modal/(.)recipes/[slug]` | `app/@modal/(.)recipes/[slug]/page.tsx` | Server — intercepts in-app navigation to a recipe and renders `RecipeDetail` inside `RecipeModal` |
| `@modal/default.tsx` | — | Returns `null` so the slot collapses on direct navigation / refresh |

Navigation uses `next/link`; active state uses `usePathname()` in `components/Navbar.tsx`. Direct navigation to `/recipes/[slug]` (refresh, external link) renders the full server page; client navigation from cards/markers gets intercepted into the modal.

### Passport overlay (not a route)

Despite `/passport` existing, the in-app passport is rendered as a **client-side overlay**, not a route push. This keeps the map's pan/zoom state intact behind the booklet.

- `components/passport/PassportOverlay.tsx` provides `PassportOverlayProvider` (mounted in `components/Providers.tsx`) and a `usePassportOverlay()` hook exposing `{ isOpen, open, close }`.
- `components/passport/PassportAffordance.tsx` (in the navbar) calls `open()` and captures the click origin via `lib/passport-origin.ts`, which `PassportModal` uses as the CSS `transform-origin` for an origin-scale animation.
- The booklet itself is `PassportBooklet` → `BookletShell` + `SpreadView`, with paging hooks in `components/passport/hooks/` (`useBookletNav`, `usePassportSpreads`).
- "Page chrome" (close, help, prev/next) is rendered as `InkMark`-wrapped controls (`CloseInkMark`, `HelpInkMark`, `PageTurnInkMark`) so they look like rubber-stamped marks rather than UI buttons.
- Region progress along the booklet edge: `RegionChipStrip` + `RegionChip`.

### Auth (anonymous Supabase sessions)

Cooked stamps are scoped to a Supabase user, but there's no login UI — `lib/supabase/anonymous.ts#ensureAnonymousSession` calls `signInAnonymously()` if no session exists. `Providers` runs this once on mount and exposes `useSessionReady()` so dependent queries (`useCookedStamps`, `useLogCook`) only fire after the session is established. `passport_stamps` RLS policies require `auth.uid() = user_id`.

### Data layer

Two Supabase tables (defined in `scripts/schema.sql`):

- `public.recipes` — anon-readable SELECT policy.
- `public.passport_stamps` — RLS scoped to `auth.uid()` for select/insert/delete.

Lib modules:
- `lib/types.ts` — `Recipe`, `DbRecipe`, `Filters`, `CulinaryRegion` (11 regions), `SubCulinaryRegion`, `Continent`, plus `CULINARY_REGION_ORDER` / `CONTINENT_ORDER` / `CONTINENT_OF` and `dbToRecipe()` (snake_case → camelCase).
- `lib/filters.ts` — `ALL_TAGS`, `DEFAULT_FILTERS`, `applyFilters`, `countActiveFilters`.
- `lib/regions.ts` — `COUNTRY_TO_REGION` (numeric ISO → region), `COUNTRY_NAME_TO_REGION` fallback (Kosovo, N. Cyprus, Somaliland), `REGION_CENTERS`, `REGION_LABEL_POSITIONS`, choropleth constants for both themes (`CHOROPLETH_*`, `SEPIA_CHOROPLETH_*`).
- `lib/passport.ts` — `Stamp`, `EXPLORER_TITLES` tier ladder, `summarizeStamps()`, `progressToNextTier()`.
- `lib/passport-pack.ts`, `lib/passport-recommend.ts` — booklet content packing and recommendations.
- `lib/passport-stamps.ts` — `CUSTOM_STAMPS` map of country → custom stamp WebP filename in `public/stamps/`. Add new countries here when you ship a custom stamp design.
- `lib/passport-origin.ts` — module-level store for the affordance's click origin (used by the overlay's open animation).
- `lib/stamp-traits.ts` — visual trait data for procedurally generated stamps (used when a country has no custom asset).
- `lib/recipes/get.ts` — `getRecipe(slug)` wrapped in React `cache()` for Server Component dedup.
- `lib/supabase/server.ts` — async `createClient()` for Server Components (cookies).
- `lib/supabase/client.ts` — `createClient()` for the browser.
- `lib/supabase/anonymous.ts` — `ensureAnonymousSession()`.
- `lib/mock-recipes.ts` — mock dataset, used by `seed:mock` and when `NEXT_PUBLIC_USE_MOCK_DATA=true`.

Hooks:
- `useRecipes` — TanStack Query, all recipes mapped via `dbToRecipe`. `staleTime: 5min` (set on the QueryClient default).
- `useFavorites` — `localStorage`-backed `Set<string>` under `"nieves-favorites"`.
- `useCookedStamps` — fetches `passport_stamps`, builds a `PassportSummary` (gated on `useSessionReady`).
- `useLogCook` / `useUndoCook` — mutations that insert/delete a stamp and compute the resulting `CookTier` (`new_country` | `new_recipe` | `repeat`) and any newly unlocked title.
- `useCookProgress` — derives progress against the next tier.
- `useUnitPref` — metric/imperial unit toggle (localStorage).
- `useMapTopology` — fetches and memoizes the world topology JSON.
- `useIsMobile` — viewport breakpoint helper.

When adding a recipe, insert a row into `public.recipes` and ensure `country` matches the `properties.name` from `world-atlas` GeoJSON. If you ship a custom country stamp asset, also add it to `CUSTOM_STAMPS` in `lib/passport-stamps.ts` and to `STATIC_PASSPORT_ASSETS` in `PassportAffordance` (so it gets prefetched).

### Map (`components/WorldMap.tsx`)

Uses `react-simple-maps` with `world-atlas` GeoJSON fetched at runtime from a CDN (cached via `useMapTopology`). Two-level drill-down:
1. Click a region → zooms to region, shows country markers and the recipe sidebar (mobile: bottom sheet).
2. Click a country marker → filters the sidebar; clicking a recipe opens it as an overlay (intercepting route → `RecipeModal`).

Other map UI:
- `MapSearch` — focus-driven expanding search input that dims the map.
- `ChoroplethLegend` — density legend.
- Keyboard zoom (`+`/`−`/`↺`).
- Choropleth fill is **quantized to a zoom band** before recomputing, to avoid recreating fill functions on every zoom delta. `getFill` blends from a light warm tone toward `CHOROPLETH_BASE` (or `SEPIA_CHOROPLETH_BASE`) by recipe density per region.

### Client vs Server Components

Everything in `components/` is a Client Component (`"use client"`) because it uses hooks, browser APIs, or interactive state. Server Components: `app/recipes/[slug]/page.tsx`, `app/@modal/(.)recipes/[slug]/page.tsx`, `app/about/page.tsx`. `app/layout.tsx` is a Server Component that renders the Client `Providers` (TanStack Query + `PassportOverlayProvider`) and `Navbar`, and accepts the `@modal` parallel slot as a prop.

### Theming (parchment + sepia)

Two warm modes, no true dark mode. Toggle is `components/ThemeToggle.tsx`; persists to `localStorage` under `nieves-theme`.

- The selected theme is applied via `document.documentElement.dataset.theme = 'sepia'`.
- A tiny **blocking script in `<head>`** (`app/layout.tsx`) reads localStorage before hydration to prevent FOUC.
- The passport is treated as a physical object — its paper does not change color when the room lights dim. Use the `passport-paper` / `passport-light` classes to lock parchment tokens regardless of theme.
- Sepia overrides for built-in Tailwind classes (`bg-white`, `text-white`, `border-white`, shadow tints, gradient stops, scrollbars, etc.) live at the bottom of `app/globals.css`. When you introduce a new utility class that breaks contrast in sepia, add a targeted override there rather than touching every call site.

### Design tokens

Custom Tailwind v4 theme tokens defined in `app/globals.css` under `@theme`:
- Colors: `parchment`, `parchment-dark`, `terracotta`, `turmeric`, `paprika`, `sage`, `teal`, `brown-dark/medium/light`, `surface`, `surface-alt`, `map-base`.
- Fonts: `font-heading` (Literata), `font-body` (Figtree), `font-stamp` (Cutive Mono), injected as CSS variables via `next/font/google` in `app/layout.tsx`.
- Stamp ink CSS vars (`--stamp-ink-brown`, `-navy`, `-forest`, `-charcoal`, `-wine`, `-slate`, `-terracotta`) for procedurally-generated stamp art.
- `--map-vignette` — warm shadow tint at viewport edges, deeper in sepia.

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
- **Parchment** (light, default): `#F5F0E4` with terracotta/turmeric/sage/teal accents.
- **Sepia** (warm-dark): deep warm browns, cream text, gold/terracotta accents — leather-bound-book feel, not a tech dashboard.

**Anti-references** (explicitly NOT this):
- Not SaaS / dashboard: no card-grid monotony, no neutral grays, no productivity-app feel.
- Not food-delivery: no commerce UI, aggressive CTAs, or coupon-bright colors.
- Not rustic / kitsch: no chalkboard fonts, burlap textures, or country-kitchen energy.

### Design Principles
1. **Publication, not product.** Every screen is a magazine spread: typographic hierarchy first, whitespace respected, photography given room. Affordances are earned, not sprinkled.
2. **The passport is the soul.** Stamps and postal details are the signature visual language, but live inside the passport and journey moments. Scarcity is what makes them feel collectible.
3. **Warm restraint.** Warm palette, disciplined composition. 60-30-10 intentionality, tint neutrals toward the warm hue, never pure black/white.
4. **Typography does the heavy lifting.** A serif display face and refined body face handle hierarchy. No ornament to prop up weak typography. (Current pairing: Literata + Figtree, with Cutive Mono for postal/stamp accents.)
5. **Delight at milestones, calm everywhere else.** Motion, confetti, and flourish are reserved for moments that matter (unlocking a region, earning a stamp, completing a journey). The rest of the app is quiet on purpose.
