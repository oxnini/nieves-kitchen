# Table · Pantry · Atlas — the catalog revamp

**Date:** 2026-07-03
**Status:** Approved design, pending implementation plan
**Supersedes:** the map-as-homepage information architecture; the "Prophetic Foods page" sketch in TODO.md (absorbed here)

## 1. Problem

Nieves Kitchen's organizing principle (world atlas + country stamps) no longer matches its mission (trusted, beautifully-made home for halal, health-forward cooking, including Sunnah foods). Concretely:

- The map organizes by **origin**; the mission organizes by **purpose** (halal trust, nourishment, Sunnah). A first-time visitor looking for trustworthy healthy halal food lands on an atlas.
- The map creates **content pressure in the wrong direction**: empty countries feel like debt, pushing authoring toward geography instead of the mission. Content velocity is the strategic bottleneck (see 2026-06-06 business validation strategy), so a misdirecting organizing principle is a real cost.
- The one-recipe-one-country model breaks for the actual catalog: fusion recipes (chinese-prawn-spaghetti, dumpling-lasagna) have **influences**, plural; everyday healthy recipes and some Sunnah dishes have **no country at all**.
- Realistic future mix (user's own estimate): mostly everyday healthy/high-protein food, many dishes *inspired by* country cooking, a Sunnah thread, and mix-and-match side dishes. Regular standalone recipes (lasagna) remain the default case.

## 2. What we keep (validated in brainstorming)

The user would genuinely miss, and we preserve:

1. **The wow first impression** — replaced by a new wow (the Table spread), not deleted.
2. **The travel-story identity** — the map survives whole as a destination (`/atlas`); the About story links stay.
3. **Browsing by place** — still available on the Atlas, now more honest (influences, plural).
4. **The passport craft and the collecting soul** — preserved intact; long-term it becomes the travel chapter of a larger Cook's Journal (§8).

## 3. Locked decisions and their rationale

| Decision | Choice | Why |
|---|---|---|
| Front door | Editorial home; Table spread hero + Pantry shelf section | User explored radical options (Table, Pantry, Journey, Question); chose Table + Pantry combined inside an editorial home |
| Map | Moves whole to `/atlas` as a destination page | Keeps all three things the user would miss without letting geography govern the catalog |
| Fusion recipes | `influences[]` (plural) shown everywhere; **primary influence** (existing `country` column) earns the stamp | Map/browse honesty + stamp scarcity + zero rework of stamp logic |
| Origin-less recipes | `influences: []`, null country/region; absent from Atlas; no country stamp | Correct, not a gap: the Atlas is the travel lens, not the catalog |
| Health voice | Between "wholesome-quiet" and "protein-forward": a small protein chip on cards where the number is a genuine selling point, filterable; never the headline | User's explicit preference; fits nutrition-tile convention and anti-SaaS principle |
| Sunnah prominence | **A thread, not a headline.** Always flagged (seal + citation) wherever prophetic food appears; never promoted to the top | User's explicit correction; mirrors the site-wide-halal / no-per-recipe-badge philosophy |
| Sunnah page | Marked Pantry now; dedicated curated page is **designed-for but deferred** — it would be a curation layer over the same pantry entries, cheap to add later | Pumpkin's card is identical on either page; data shaped once, decision deferred until the marked Pantry is visible |
| Progression system | **C: Cook's Journal contains the passport** (phase 3, own design pass) | A travel document with a "miscellaneous" appendix re-creates the original mismatch one level down; a journal holds travel memories naturally; 100% of stamp craft survives as-is |
| Execution | **Design once, ship phased** (one spec, three shippable phases) | Tiny current audience makes a big-bang relaunch moment worthless; solo-project momentum; features debut only when content can carry them |

## 4. Information architecture

| Route | Change |
|---|---|
| `/` | New editorial home (§5) |
| `/atlas` | New — the world map relocated whole (§9) |
| `/pantry` | New — ingredient shelf (§7) |
| `/recipes` | Unchanged grid + new collection/protein filters |
| `/recipes/[slug]`, `/favorites`, `/about`, `/promise`, passport overlay, `@modal` interception | Unchanged |

Navbar: **Home · Recipes · Pantry · Atlas · About · Halal** (passport affordance + theme toggle unchanged). "Halal" keeps pointing at `/promise`.

Collections are **filter presets**, not routes: `/recipes?collection=sunnah` etc. Promotable to real pages later without URL churn. The four launch collections: *High protein, honest macros* · *Sides to mix & match* · *From my travels* (deep-links to `/atlas`) · *From the Prophet's ﷺ table* (always listed last — thread, not headline).

## 5. The editorial home

Magazine spread, top to bottom. Calm everywhere; protein chips and time are the only numbers on the page.

1. **Masthead** — large serif headline in the margin-notes voice; beneath it the mission line (every recipe halal, every recipe kitchen-tested) linking to `/promise`.
2. **The Table spread (hero)** — a composed meal presented as tonight's table, elements arranged as a spread, not a card grid. Each element links to its recipe; protein chip + time sit under titles in Cutive Mono like margin annotations. Curated by hand in `data/table-spreads.ts`; rotated at the author's whim. **A spread may be a single centerpiece dish** — lasagna alone is a legitimate table; main-plus-sides is not a required formula. Designed as the **resting state of the phase-3 remix feature**: swap affordances appear on slots later; the layout does not change. Until sides exist, degrade to main + a pencilled-in "coming to the table" placeholder slot in the margin voice.
3. **Collections row** — four wide editorial banners (stamp-language mark + one-line description), order as in §4, linking into filtered `/recipes`.
4. **Pantry shelf teaser** — 6–8 ingredient stamps in flat-ink language linking to `/pantry`; prophetic ones carry the small seal. (Amendment 2026-07-03: ships with phase 2 alongside the route and the ink art — no dead links, no placeholder assets. The home layout simply gains this section then.)
5. **Latest from the kitchen** — newest recipes, two-or-three-up; footer.

Regular recipes are the default case: a recipe may belong to zero collections and simply live in `/recipes` + Latest. Nothing implies composability or macro-framing is required.

## 6. Data model

One dated migration (then folded into `schema.sql`), plus new founder-authored content modules. Existing recipes need zero manual edits beyond automatic backfill.

**`recipes` table changes:**

- `influences text[] not null default '{}'` — world-atlas country names; backfill `array[country]`.
- `country` **re-semanticized as primary influence** (name kept; stamp logic, region derivation, choropleth untouched). `country`, `region`, and `coordinates` become **nullable** for origin-less recipes (correction 2026-07-03: `coordinates` is NOT NULL today and was missed in the first draft). The existing region CHECK passes on null; map/passport code gains skip-if-null guards.
- `category` — **already exists** with CHECK `('main','dessert','drink','side')` (correction 2026-07-03: the first draft proposed adding it; no migration needed, sides are already representable).
- `passport_stamps.recipe_country` relaxed to **nullable** (correction 2026-07-03: it is NOT NULL today, so null-country cook logging requires this migration, contrary to §8's original claim).
- `is_sunnah boolean not null default false` — dish-level flag (talbina, tharid).
- `featured_ingredients text[] not null default '{}'` — pantry-entry slugs; powers "cook with it" both directions.

**New content modules (no DB):**

- `data/pantry/*.ts` — per ingredient: slug, name, ink-art asset, margin note, optional `prophetic: { note, citation }`. **Citation required whenever `prophetic` exists** (type-enforced) — structurally impossible to mark Sunnah without a source, same discipline as `lib/halal.ts`.
- `data/table-spreads.ts` — curated `{ main, sides[], note }`; home shows the latest.
- `lib/collections.ts` — collections as **predicates over existing data** (`is_sunnah`; `category === 'side'`; protein ≥ threshold; `influences.length > 0`) so membership is never a second authoring chore. Protein-chip threshold lives here as one tunable constant (initial: 25 g/serving).

**Ripple updates:** zod schemas (`DbRecipeSchema`), `dbToRecipe`, `database.types.ts`, `lib/filters.ts` (+ FilterPanel), the `/writerecipe` skill template, seed script.

## 7. The Pantry (`/pantry`)

- **Shelf:** quiet editorial grid of flat-ink ingredient cards, grouped by kind (grains & staples · fruits & sweetness · dairy & eggs · aromatics & preserved · meat & fish) under small-caps headings. No search/filters at this scale (~20–30 entries at maturity). The Pantry is the **everyday working pantry** — garlic and eggs beside dates and barley; no prophetic curation to the top.
- **Seal:** prophetic ingredients carry a small embossed-style ink mark in a card corner, wordless at shelf distance. One of the passport aesthetic's rare, earned appearances outside the passport.
- **Entry view:** in-page expansion/small overlay (shelf stays behind, passport-overlay instinct). Contains: larger art + margin note (2–3 sentences of the author's voice); if prophetic, a set-apart passage with seal, note, and citation (narrator + collection, Cutive Mono, margin-reference styling) — warm, factual, never preachy, never without a real source; **"Cook with it"** — recipes whose `featured_ingredients` include the entry, small cards. Zero-recipe state: one honest line in the margin voice, never a broken-looking dead end.
- **Authoring:** one small `.ts` file + one ink asset through the established stamp ingest pipeline (alpha rules apply). The shelf design is credible at 8 entries.

## 8. Progression: the Cook's Journal (phase 3 direction)

- **Now (phase 1):** cook-logging tolerates null country (requires the `recipe_country` nullable migration, §6). Cook tier resolves to `new_recipe` when country is null; the milestone moment still fires; the row waits in the ledger. No cook is ever lost. Rate-limit trigger, RLS, tier ladder untouched.
- **Phase 3:** a linen-bound **Cook's Journal** becomes the progression container: every cook is a date-stamped entry (Cutive Mono) with the dish's mark and room for a personal margin note; **collection pages** whose seals ink in as you cook them (Sunnah page, sides page, high-protein mark); **milestone marks** (first cook, tenth, a fully composed Table) — rare by design. The **existing passport lives inside, whole, as the travel chapter**: region spreads, country stamps, chip strip exactly as built. Region progress and explorer titles stay country-based (they are travel metrics; origin-less cooking correctly never advances them).
- Everything derives from existing `passport_stamps` rows joined against recipe data — no new tables, no new writes. Journal art, page layout, and the milestone list get **their own design pass** when phase 3 arrives; this spec fixes the mechanics and the metaphor so nothing built earlier moves.

## 9. The Atlas (`/atlas`) — relocation + seamlessness pass

The map moves whole (desktop + mobile implementations, drill-down, search, choropleth legend, keyboard zoom) behind a short editorial masthead framing it as the travel story, linking to About.

**Content changes:** recipes appear under **every** influence (join reads `influences` instead of `country`); origin-less recipes never appear here (correct, not a gap).

**Experience bar: "Google Maps smooth, Nieves-toned."** Research-informed standards, in priority order:

1. **Camera flight = van Wijk & Nuij smooth zooming** (`d3.interpolateZoom`), replacing the current linear lerp + `easeInOutCubic` in `zoomTo`. This is the algorithm behind Mapbox `flyTo`: long moves arc *out then back in*, short moves ease directly, and the viewer never loses orientation. Applies to continent/region click, search-result flight, breadcrumb, and reset. `d3-interpolate` added as an explicit dependency.
2. **Kill the animation feedback loop** (the "maximum update depth" TODO item): the rAF `tick` → `setControlledPos` → `onMoveEnd` → snap-back cycle causes visible fighting at flight end and console noise. Guard `handleMoveEnd` fully during programmatic animation. This graduates from TODO to in-scope because seamlessness is now a stated requirement — with the existing TODO caveat: zoom logic is load-bearing; manually test continent/search/breadcrumb zoom in both themes.
3. **One camera authority at a time** (Mapbox convention): starting any programmatic flight cancels the previous one; any user gesture (wheel, drag, pinch) immediately cancels programmatic animation and hands control back (partially present; make it airtight).
4. **Progressive disclosure by zoom, faded not popped:** markers/labels fade in/out on zoom-band thresholds with short opacity transitions (partially present; audit every layer — nothing may pop into existence). Choropleth zoom-band quantization stays.
5. **Interaction feedback ≤ 100 ms:** hover/press states on geographies and markers respond instantly (CSS transitions, no React round-trip where avoidable).
6. **Loading:** topology fetch gets a parchment skeleton with fixed dimensions — zero layout shift; map fades in when ready.
7. **`prefers-reduced-motion`:** flights become near-instant crossfades; ambient motion disabled.
8. **Performance guardrails:** no per-frame React re-render of geography fills during flight (the quantization pattern extends to any new zoom-coupled visual); target 60 fps on programmatic flights on a mid-tier laptop.

## 10. Voice & copy rules (apply throughout)

- ﷺ convention respected in all user-facing copy; exact rendering already in use on `/promise` and TODO ("Prophet ﷺ").
- Never fabricate a hadith/ruling; citation fields are structurally required (§6, §7). Sourcing discipline per the halal trust-voice rules.
- No em dashes in user-facing website strings.
- All recipes halal, always; no alcohol anywhere, including suggested substitutions.
- Margin-notes voice: confident, warm, never preachy; empty states honest and in-voice, never apologetic UI-speak.
- iOS: any text input ≥ 16 px font (existing rule).

## 11. Phasing

Each phase gates on `npm run typecheck` + `npm run build` (CI parity). Every phase ships alone and is designed as the final version's resting state.

- **Phase 1 — the pivot:** migration (§6) · editorial home (§5, static curated Table) · map → `/atlas` + navbar · protein chip · `?collection=` param handling in `/recipes` (amendment 2026-07-03: pulled forward from phase 2 because the home's collections row links need it; the FilterPanel collection UI stays phase 2) · null-country cook logging · `/writerecipe` + seed updates. The Atlas editorial masthead lands with the phase 1.5 polish. *Kills the mission mismatch by itself.*
- **Phase 1.5 — Atlas seamlessness:** §9 items 1–7 (camera, loop fix, cancellation, fades, feedback, loading skeleton, reduced motion). Separated from phase 1 so the risky zoom-logic changes don't block the IA pivot.
- **Phase 2 — the Pantry:** `/pantry` + `data/pantry/` + seals/citations + "cook with it" + collection filters in `/recipes` + first batch of entries and ink art.
- **Phase 3 — the earned layer** (each gated on content critical mass, own design passes): Table remix affordances (needs real sides) · Cook's Journal containing the passport (§8) · dedicated Sunnah page decision revisited once the marked Pantry is live.

## 12. Out of scope

- Rebuilding any part of the map's zoom/gesture internals beyond §9.
- The dedicated Sunnah page (deferred, designed-for).
- Collection routes/pages (filter presets only).
- Journal visual design (phase 3's own pass).
- Retention analytics / acquisition tests (still paused per business strategy).
- Recipe detail page changes (separate TODO track).

## 13. Risks

- **Content dependency:** the Table hero with one main and a placeholder must still look intentional — design the placeholder as a real editorial element, not an apology. Mitigation: single-centerpiece spreads are first-class.
- **Zoom-logic regression (phase 1.5):** load-bearing code; mitigation: phase separation + the manual test matrix from TODO (continent/search/breadcrumb zoom, both themes, desktop + mobile).
- **Phase 3 drift:** deferred features die quietly; mitigation: this spec + TODO entries at phase boundaries.
- **Seal kitsch risk:** the prophetic seal must stay small and wordless at shelf distance or the Pantry tips promotional — violating the thread-not-headline decision.
