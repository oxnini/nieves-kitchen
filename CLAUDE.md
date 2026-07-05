# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server (Next.js HMR)
npm run build            # Production build
npm run start            # Serve production build
npm run typecheck        # tsc --noEmit — the real correctness gate
npm run seed:mock        # Seed Supabase from scripts/seed-mock.ts (needs SERVICE_ROLE_KEY)
npm run optimize-images  # Convert all PNG/JPG in public/ to WebP
```

There is also a `lint` script (`next lint`), but no ESLint flat config is checked in and `next lint` is deprecated in this Next version, so it does nothing useful — **use `npm run typecheck` to validate changes**. No unit test suite is configured; correctness is enforced by `tsc` and a production build.

CI: `.github/workflows/ci.yml` runs `npm run typecheck` then `npm run build` on every PR into `main` (Node 20, `npm ci --legacy-peer-deps`). Match it locally before pushing.

`husky` is wired via the `prepare` script — installs a pre-commit hook that auto-converts staged PNG/JPG → WebP for files inside `AUTO_CONVERT_DIRS` (`.husky/pre-commit`).

Environment: copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required for all data.
- `SUPABASE_SERVICE_ROLE_KEY` — only needed for `seed:mock`. Never imported into client code.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile **site** key (public). Required for anonymous sign-ins now that Supabase enforces captcha; without it, anonymous sessions cannot be created in environments where the user has no existing session.
- `NEXT_PUBLIC_USE_MOCK_DATA=true` — swaps the recipe source for `lib/mock-recipes.ts` (dev only).

## Architecture

**Nieves Kitchen** is a Next.js 15 (App Router) + React 19 + TypeScript app for browsing global recipes on an interactive world map, backed by Supabase. Favorites persist in `localStorage`; cooked-recipe "stamps" persist in Supabase against an anonymous user session.

Key dependencies: `@tanstack/react-query`, `@supabase/ssr` + `@supabase/supabase-js`, `react-simple-maps`, `framer-motion`, `canvas-confetti`, `recharts`, `rc-slider`, `lucide-react`, `zod` (runtime validation of DB rows), `@marsidev/react-turnstile` (Cloudflare captcha for anonymous auth), `server-only` / `client-only` (import-boundary guards), Tailwind v4.

### Routing

App Router structure under `app/`. The root layout uses a **parallel `@modal` slot** so recipe detail pages can render as overlays on top of the current view without losing the map/list behind them.

| Route | File | Rendering |
|-------|------|-----------|
| `/` | `app/page.tsx` | Server — editorial home: `Masthead`, `TableSpreadHero`, `CollectionsRow`, `PantryTeaser`, `LatestFromKitchen` (recipe-driven children self-fetch via `useRecipes`); reads landed pantry art via `landedPantryEntries()` |
| `/atlas` | `app/atlas/page.tsx` | Client — the interactive `WorldMap` + `MapSearch` + `FilterPanel` (moved here from `/` in the phase 1 revamp) |
| `/recipes` | `app/recipes/page.tsx` | Client — card grid + `FilterPanel`; reads `?collection=` / `?country=` presets from the URL |
| `/recipes/[slug]` | `app/recipes/[slug]/page.tsx` | Server — Supabase fetch via cached `getRecipe()`, `generateMetadata` (SEO) |
| `/pantry` | `app/pantry/page.tsx` | Server shell (fs-resolves landed art via `landedPantryEntries()`) → client `PantryShelf` + entry overlay |
| `/favorites` | `app/favorites/page.tsx` | Client — reads from `localStorage` |
| `/about` | `app/about/page.tsx` | Server — static |
| `/passport` | `app/passport/page.tsx` | Client — standalone `PassportBooklet` route (rarely hit; in-app the overlay is preferred) |
| `@modal/(.)recipes/[slug]` | `app/@modal/(.)recipes/[slug]/page.tsx` | Server — intercepts in-app navigation to a recipe and renders `RecipeDetail` inside `RecipeModal` |
| `@modal/default.tsx` | — | Returns `null` so the slot collapses on direct navigation / refresh |

Navigation uses `next/link`; active state uses `usePathname()` in `components/Navbar.tsx`. Direct navigation to `/recipes/[slug]` (refresh, external link) renders the full server page; client navigation from cards/markers gets intercepted into the modal. `app/recipes/[slug]/loading.tsx` provides the route-level suspense fallback.

`app/dev/*` holds scratch/preview routes for visual iteration on stamps and UI experiments (e.g. `dev/cancellation`, `dev/cook-mode`, `dev/passport-cover`, per-country stamp previews). They share `app/dev/layout.tsx` and are not part of the shipped navigation; treat them as a design sandbox.

### Passport overlay (not a route)

Despite `/passport` existing, the in-app passport is rendered as a **client-side overlay**, not a route push. This keeps the map's pan/zoom state intact behind the booklet.

- `components/passport/PassportOverlay.tsx` provides `PassportOverlayProvider` (mounted in `components/Providers.tsx`) and a `usePassportOverlay()` hook exposing `{ isOpen, open, close }`.
- `components/passport/PassportAffordance.tsx` (in the navbar) calls `open()` and captures the click origin via `lib/passport-origin.ts`, which `PassportModal` uses as the CSS `transform-origin` for an origin-scale animation.
- The booklet itself is `PassportBooklet` → `BookletShell` + `SpreadView`, with paging hooks in `components/passport/hooks/` (`useBookletNav`, `usePassportSpreads`).
- "Page chrome" (close, help, prev/next) is rendered as `InkMark`-wrapped controls (`CloseInkMark`, `HelpInkMark`, `PageTurnInkMark`) so they look like rubber-stamped marks rather than UI buttons.
- Region progress along the booklet edge: `RegionChipStrip` + `RegionChip`.
- Stamp rendering: a country with a custom asset (`CUSTOM_STAMPS`) shows the WebP; otherwise a procedural stamp is drawn from one of the shape components in `components/passport/stamps/` (`OvalBadge`, `Hexagonal`, `Diamond`, `OfficialRect`, `WavyCircle`, etc., dispatched via `stamps/index.tsx`) using `lib/stamp-traits.ts`. `CancellationMark` overlays a postmark-style cancellation (`lib/cancellation-traits.ts`).

### Auth (anonymous Supabase sessions + Turnstile)

Cooked stamps are scoped to a Supabase user, but there's no login UI. Supabase enforces a captcha on anonymous sign-ins, so the flow is:

1. On mount, `Providers` (`components/Providers.tsx`) reads `supabase.auth.getSession()`. If a session already exists, it flips `sessionReady` true and does nothing else.
2. If there's no session, it sets `needsCaptcha` and renders a Cloudflare `<Turnstile>` widget (bottom-right, `appearance: 'interaction-only'`).
3. On captcha success, it calls `lib/supabase/anonymous.ts#ensureAnonymousSession(client, token)`, which passes the token as `signInAnonymously({ options: { captchaToken } })`.

`useSessionReady()` gates dependent queries (`useCookedStamps`, `useLogCook`/`useUndoCook`) so they only fire after the session is established. `passport_stamps` RLS policies require `auth.uid() = user_id`, and a DB trigger rate-limits inserts (see Data layer). If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset, the widget never renders and new anonymous sessions can't be created.

### Data layer

Two Supabase tables. `scripts/schema.sql` is the current canonical schema (recipe-detail v2 shape: grouped `ingredients`/`steps` jsonb, split `time_active`/`time_total`/`time_resting`, dietary booleans, editorial fields). The `scripts/migrations/*.sql` files are the dated, idempotent steps that got an existing DB there — apply new schema changes as a new migration file, then fold the result into `schema.sql`:

- `2026-05-05-rate-limit-stamps.sql` — `before insert` trigger on `passport_stamps`: max 5 stamps per (user, recipe_slug) per 24h, 10k lifetime cap per user. Anti-spam.
- `2026-05-22-recipe-detail-v2.sql` — migrates flat ingredients/steps → grouped shape, splits time fields, adds editorial columns.
- `2026-05-31-region-check-and-image-not-null.sql` — `CHECK` constraint pinning `recipes.region` to the 11 `CulinaryRegion` values, `image_url` NOT NULL default `''`, B-tree indexes on `region` and `country`. Has a preflight that aborts if any row's region is off-whitelist.

Tables:
- `public.recipes` — anon-readable SELECT policy (`to anon, authenticated using (true)`); no write policy, so writes only happen via the service role (`seed:mock`).
- `public.passport_stamps` — RLS scoped to `auth.uid()` for select/insert/delete, plus the rate-limit trigger above.

Rows from Supabase are **validated at the edge**: `useRecipes` runs each row through `DbRecipeSchema.safeParse` (zod, from `lib/types.ts`) and drops malformed rows with a console error rather than letting bad data reach the UI. `lib/database.types.ts` holds the generated Supabase row types.

Lib modules:
- `lib/types.ts` — `Recipe`, `DbRecipe`, `Filters`, `CulinaryRegion` (11 regions), `SubCulinaryRegion`, `Continent`, plus `CULINARY_REGION_ORDER` / `CONTINENT_ORDER` / `CONTINENT_OF`, `dbToRecipe()` (snake_case → camelCase), and the zod schemas `DbRecipeSchema` / `DbRecipeIndexSchema`.
- `lib/database.types.ts` — generated Supabase table/row types.
- `lib/filters.ts` — `ALL_TAGS`, `DEFAULT_FILTERS`, `applyFilters`, `countActiveFilters`.
- `lib/units.ts` — metric/imperial conversion helpers (pairs with `useUnitPref`).
- `lib/regions.ts` — `COUNTRY_TO_REGION` (numeric ISO → region), `COUNTRY_NAME_TO_REGION` fallback (Kosovo, N. Cyprus, Somaliland), `REGION_CENTERS`, `REGION_LABEL_POSITIONS`, choropleth constants for both themes (`CHOROPLETH_*`, `SEPIA_CHOROPLETH_*`).
- `lib/passport.ts` — `Stamp`, `EXPLORER_TITLES` tier ladder, `summarizeStamps()`, `progressToNextTier()`, `computeTitle()`.
- `lib/passport-pack.ts`, `lib/passport-recommend.ts` — booklet content packing and recommendations.
- `lib/passport-empty-copy.ts` — editorial copy for empty-region passport spreads.
- `lib/passport-prefetch.ts` — the asset list / prefetch helper for the passport overlay.
- `lib/passport-stamps.ts` — `CUSTOM_STAMPS` map of country → custom stamp WebP filename in `public/stamps/`. Add new countries here when you ship a custom stamp design.
- `lib/passport-origin.ts` — module-level store for the affordance's click origin (used by the overlay's open animation).
- `lib/stamp-traits.ts` — visual trait data for procedurally generated stamps (used when a country has no custom asset).
- `lib/cancellation-traits.ts` — trait data for cancellation marks (the postmark/cancellation system over stamps).
- `lib/recipes/get.ts` — `getRecipe(slug)` wrapped in React `cache()` for Server Component dedup.
- `lib/recipes/duration-detect.ts` — parses durations out of step text (for inline timers).
- `lib/supabase/server.ts` — async `createClient()` for Server Components; cookies are written `httpOnly`, `sameSite: 'lax'`, `secure` in production.
- `lib/supabase/client.ts` — `createClient()` for the browser (`import 'client-only'` guard).
- `lib/supabase/anonymous.ts` — `ensureAnonymousSession(client, captchaToken?)`.
- `lib/mock-recipes.ts` — mock dataset, used when `NEXT_PUBLIC_USE_MOCK_DATA=true`. `scripts/seed-mock.ts` carries its own legacy-shape mock data and lifts it into the v2 row shape on insert.
- `lib/pantry/landed.ts` — `landedPantryEntries()` (server-only): the pantry entries whose ink art exists in `public/pantry/`, in shelf order. The single source of truth shared by `/pantry` and the home `PantryTeaser` so they can never disagree about which entries have shipped. No placeholder art ships; an entry surfaces only once its `<slug>.webp` lands.
- `lib/collections.ts` — `COLLECTIONS` (the four editorial lenses, `sunnah` always last), `COLLECTION_ACCENTS`, `PROTEIN_CHIP_THRESHOLD`. Collections are URL presets (`?collection=` on `/recipes`; `travels` links to `/atlas`), not `Filters` state, so they never bump the FilterPanel badge.

The **pantry content module** is `data/pantry/` (parallel to `data/recipes/`): `_types.ts` (`PantryEntry`, `PantryKind`, `KIND_ORDER`), one hand-authored file per entry, and `index.ts` exporting the ordered `PANTRY` + `pantryBySlug()`. Every `prophetic` entry requires a verified `citation` (same trust rule as `lib/halal.ts` — never fabricate a narration or reword it past its source). A recipe links to a pantry entry via `featuredIngredients: string[]` (pantry slugs); `scripts/seed-recipes.ts` validates every slug against `PANTRY` and aborts on an orphan. The `/dev/pantry` route is the design sandbox (all card/seal variants); production ships variant D "etched" cards + the rosette seal (`components/pantry/`).

Hooks:
- `hooks/queryKeys.ts` — centralised TanStack Query keys so producers and cache-peekers don't drift. `recipesQueryKey(source)` for the full recipe list; `recipeIndexQueryKey(source)` reserved for a slim index. `source` is `'mock' | 'live'` keyed off `NEXT_PUBLIC_USE_MOCK_DATA`. (A past bug where `useLogCook` read `['recipes']` but `useRecipes` wrote `['recipes','live']` silently broke region-tier unlocks — always use these helpers.)
- `useRecipes` — TanStack Query, all recipes parsed via `DbRecipeSchema` then `dbToRecipe`. `staleTime: 5min` (set on the QueryClient default in `Providers`).
- `useFavorites` — `localStorage`-backed `Set<string>` under `"nieves-favorites"`.
- `useCookedStamps` — fetches `passport_stamps`, builds a `PassportSummary` (gated on `useSessionReady`).
- `useLogCook` / `useUndoCook` (both in `hooks/useLogCook.ts`) — mutations that insert/delete a stamp and compute the resulting `CookTier` (`new_country` | `new_recipe` | `repeat`) and any newly unlocked title; they peek at the cached recipe list (via `recipesQueryKey()`) to map country → region.
- `useCookProgress` — derives progress against the next tier.
- `useTheme` / `useIsSepia` / `setTheme` / `initTheme` (`hooks/useTheme.ts`) — `useSyncExternalStore`-backed theme store; `ThemeToggle` calls `setTheme`.
- `useUnitPref` — metric/imperial unit toggle (localStorage).
- `useMapTopology` — fetches and memoizes the world topology JSON.
- `useChoroplethFill` — memoized region-density fill function for the map.
- `useMobileMapPosition` — drives the mobile map's pan/zoom state.
- `useIsMobile` — viewport breakpoint helper.
- `useElementInViewport`, `usePageTimer`, `useWakeLock` — viewport-intersection helper, recipe page dwell timer, and screen wake-lock for cook mode.

When adding a recipe, insert a row into `public.recipes` and ensure `country` matches the `properties.name` from `world-atlas` GeoJSON. If you ship a custom country stamp asset, also add it to `CUSTOM_STAMPS` in `lib/passport-stamps.ts` and to the passport prefetch list (`lib/passport-prefetch.ts`, surfaced by `PassportAffordance`) so it gets prefetched.

### Security

- **Secrets:** only the public anon key and Turnstile **site** key reach the client (both `NEXT_PUBLIC_*`). The service role key is used solely in `scripts/seed-mock.ts` and must never be imported into app code. The Supabase project URL appearing in `next.config.ts`/CSP is public, not a secret.
- **Response headers** are set in `next.config.ts#headers()` for all paths: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, and HSTS (`max-age=63072000; includeSubDomains; preload`).
- **CSP** is currently `Content-Security-Policy-Report-Only` (it reports violations but does not block). It allows `self`, Cloudflare Turnstile (`challenges.cloudflare.com`), Google Fonts, Unsplash images, and the Supabase project origin (https + wss). Before promoting it to an enforcing `Content-Security-Policy`, exercise the app and confirm the report log is clean — note `script-src` still includes `'unsafe-inline'`, which weakens it.
- **Database:** RLS is enabled on both tables; `passport_stamps` writes are owner-scoped and rate-limited by the trigger in `scripts/migrations/2026-05-05-rate-limit-stamps.sql`. `recipes` has no write policy, so the app can only read it.
- **Auth cookies** written by the server client are `httpOnly` + `sameSite: lax` + `secure` in production.

### Map (`components/WorldMap.tsx`)

`WorldMap` is a thin dispatcher: it reads `useIsMobile()` and renders `WorldMapDesktop` or `WorldMapMobile`. Desktop and mobile have diverged enough (gestures, layout, bottom-sheet vs sidebar) to warrant separate implementations; shared mobile canvas pieces live in `components/map/` (`MobileMapCanvas`, `MapCoachmark`). When you change map behavior, check whether it belongs in one or both.

Both use `react-simple-maps` with `world-atlas` GeoJSON fetched at runtime from a CDN (cached via `useMapTopology`). Two-level drill-down:
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

Two warm modes, no true dark mode. State lives in `hooks/useTheme.ts` (a `useSyncExternalStore` store: `useTheme`/`useIsSepia` to read, `setTheme` to write); `components/ThemeToggle.tsx` is the UI. Persists to `localStorage` under `nieves-theme`.

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

1. **Format: WebP only.** Drop the source `.png`/`.jpg` into `public/`, then either run `npm run optimize-images` (converts everything in `public/`) or just `git commit` — a pre-commit hook auto-converts staged PNGs/JPGs that live inside the opt-in folders listed in `.husky/pre-commit` (currently `public/passport-bg/`, `public/stamps/`, `public/passport-tiers/`, and `public/pantry/`). To enable auto-conversion for a new folder, add it to `AUTO_CONVERT_DIRS` in that hook. PNGs in other locations (favicons, OG images, etc.) are left alone.
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
