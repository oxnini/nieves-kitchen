# The Cook's Journal — phase 3 design brief

**Date:** 2026-07-05
**Status:** Approved design, pending implementation plan
**Parent:** `docs/superpowers/specs/2026-07-03-table-pantry-atlas-revamp-design.md` (§3 progression decision, §8 Journal direction)
**Amends the parent:** the Journal is an **editorial scroll at `/journal`**, not a paged booklet. The passport's *stamp craft* is kept whole but re-homed from the `BookletShell` paging engine into a scroll section. The metaphor ("the Cook's Journal contains the passport as its travel chapter") holds; the **container form changes** from booklet-with-spreads to a single scrolling page. See §3 and §8 below for the rationale and the component inventory this touches.

---

## 1. Problem — why this design, not the passport-as-container

The passport does not feel wrong because of craft. It feels wrong because of its **shape**: it presents a *fixed, complete universe* (all 10 regions, every country) and shows the cook that most of it is blank. A pre-drawn grid of empty slots reads as **debt** — a to-do list nobody asked for. Every empty country is a quiet "you haven't done this."

Two consequences follow, and both are load-bearing for this design:

1. **Any completion mechanic recreates the flaw one level down.** Per-collection seal ladders (Sunnah / Sides / High-protein filling toward "all cooked") were explored and **rejected**: they would tell a non-Muslim cook, or anyone who simply cooks other things, that they are *incomplete* on parts that were never theirs. Nieves' Kitchen has a mixed audience (Muslim and non-Muslim, everyday cooks and travellers); no one should ever feel obligated to fill every component. A moving-denominator meter (collection membership is a predicate over a *growing* catalog) also literally regresses when a new recipe ships — the seal un-fills. Rejected.

2. **The pull to explore is worth keeping, but not as a fixed grid.** Collecting is genuinely motivating. The distinction that matters is **"one open door ahead of you" vs. "every closed door shown at once."** Keep the collecting; drop the ledger of what is missing.

## 2. Governing principle

> **Never show an empty slot or an unearned badge. The book only ever contains what the cook actually did, described warmly. Patterns are discovered in hindsight, never displayed as a checklist to complete.**

A passport is a fixed set of slots you try to fill. A journal is additive: it starts empty and only ever holds what you did, so nothing is ever "missing." This is the anti-passport, and it resolves both worries at once — no obligation, no "you're behind," and it reads identically for every kind of cook. The book becomes a **mirror of what you cook, not a scoreboard.**

Everything below is a consequence of this principle.

## 3. Format — an editorial scroll at `/journal`

**Decision:** the Journal is a single vertical **editorial scroll** on its own **route, `/journal`**, not an overlay and not a paged booklet.

**Why a scroll, not the booklet:**
- **The Log grows forever.** A diary of every cook is an infinite feed; infinite feeds fight pagination. A scroll flows; a book must be split across turned pages.
- **Mobile.** The two-page spread is already cramped (open TODO to go one-page); flipping is a fiddly small-screen gesture. A vertical scroll is the native mobile motion.
- **The flip was the weakest part.** The 3D page-flip was already rejected; the remaining 2D transition mostly just *hides* content behind a click. What people love about the passport is the **stamps as collectible marks** and the **ceremony of opening something personal** — neither requires turning pages.
- **"Publication, not product."** The brand's first design principle is "every screen is a magazine spread." A magazine feature *scrolls*. The scroll fits the identity better than a skeuomorphic book, and gets the infinite-log and mobile wins for free.

**Why a route, not an overlay:** the passport is an overlay to preserve the map's pan/zoom behind it. A scroll has nothing to preserve behind it, and the Journal is a substantial destination *about the cook*. `/journal` is a first-class page; the navbar affordance links to it.

**Physical warmth without pagination:** paper texture, ledger rules, a masthead, deckled section breaks, and the stamp/postmark craft carry the "bound personal object" feeling. The hand-made quality comes from the content being *yours* and the materials, not from a flip gesture.

## 4. The scroll, section by section

Every section obeys §2: **it only renders when the cook has something in it.** A brand-new cook opens a near-blank, intentional page — never a table of empty slots.

**4.1 Masthead — "who you are."**
*The Cook's Journal* title, the cook's name/handle if available, and **only-counts-up stats** (meals cooked · dishes · corners of the world touched). Warm, celebratory, calm. **No "next tier" / "N from the next title" line** — the forward pull lives on the Atlas (§7), and a "you're behind" line here would reintroduce the scoreboard. The ranked explorer title does **not** headline here (see §4.4).

**4.2 The Log — the spine.**
Reverse-chronological feed of **every cook, including re-cooks** (a diary records repetition; re-cooks are styled lightly, e.g. "cooked again"). Each entry:
- **Date** in Cutive Mono (the postal/ledger accent).
- **The dish's mark** — the country **mini-stamp** for a travel cook; a **quiet dish mark** for an origin-less cook (a small, non-country seal, so weeknight cooking sits with equal dignity beside travelled cooking).
- **Title**, linking to the recipe (`/recipes/[slug]`, intercepts into the modal as usual).
- **One derived margin note** in the author's voice (§5).

This is where **origin-less cooks finally get a home**: the everyday lasagna sits in the Log exactly like the Turkish eggs — no country required, no gap implied. The Log grows forever; it lazy-loads as it lengthens, with month dividers.

**4.3 What the book has noticed — reflections.**
Occasional **pull-quotes** set into the Log, magazine-style, that surface **only when true of the cook**: "You keep returning to the Prophet's ﷺ table," "Most of your cooking is quick and protein-forward," "Turkey, more than anywhere." If a pattern is not the cook's, its line **simply never appears** — no empty seal, no nag. These reflections are the personality that *replaces* the rejected collection-seal ladders: the book noticing you, never grading you.

**4.4 Stamps collected — the travel craft, re-homed.**
An inline gallery of the stamps the cook has **earned**, grouped **only by regions actually touched** (no empty region groups). Same stamp art, same seeded per-recipe postmarks. Tapping a stamp opens the existing per-country recipes view (`StampedRecipesModal`).
- **The five explorer titles relocate here** (from the old inside-front "Traveler profile"). They are earned by **travel breadth** and belong with travel: New Explorer → Curious Cook (1 country, 1 region) → Wanderer (5, 2) → Globetrotter (10, 4) → Culinary Diplomat (20, 10). Kept as a **travel identity**, not the masthead rank — so the book never calls a prolific everyday cook "New Explorer" for cooking the "wrong" things. The `TierLedger` component moves into this section. No "next tier" debt line; the title is shown as earned identity only.
- A quiet **"see your world on the atlas →"** link hands off to the map (§7).

**4.5 Milestone marks.**
A small inline row of **earned** seals, **retrospective only** — revealed *after* the moment they are earned, never shown in advance as locked quests. Rare by design (§6).

**4.6 Empty / nascent state.**
At zero cooks: masthead + one warm line ("Your journal is blank. It fills one dish at a time."), and nothing else. No empty sections render. It reads as intentional at the very first cook, and each section appears the moment it has content.

## 5. Derivation grammar (all derived, zero new writes)

Everything is computed from existing `passport_stamps` rows joined against recipe data. **No new tables, no new writes, no migration.** The margin note *looks* handwritten but is generated; there is no free-text input (a real editable note was explicitly deferred to keep phase 3 pure-derivation and avoid the app's second write path).

**5.1 Per-entry margin note (Log).** One line per entry, highest-priority applicable rule wins:
- very first cook ever → "your first dish."
- first cook of a country → "your first from {country}."
- first `is_sunnah` cook → "your first from the Prophet's ﷺ table."
- Nth cook of the same recipe (N ≥ 2) → "cooked again" / "your {N}th time at this dish."
- otherwise → a quiet contextual line (e.g. "your {N}th from {region}") or nothing.

**5.2 Global reflections (pull-quotes).** Only emitted when their truth condition holds; a starter set (tunable, extend later):
- returning to a place: ≥ N cooks from one country/region → "You keep returning to {place}."
- protein-forward majority: majority of cooks are high-protein / short active time → "Most of your cooking is quick and protein-forward."
- the Sunnah thread: ≥ N `is_sunnah` cooks → "You keep returning to the Prophet's ﷺ table."
- breadth: regions touched ≥ N → "You've cooked in {N} corners of the world."

Copy is placeholder-in-voice; final strings pass the §9 voice rules. Thresholds live beside the existing tunables (extend `lib/collections.ts` / a small `lib/journal.ts`).

## 6. Milestone set (retrospective, rare)

Earned marks, revealed after the fact, never pre-shown:
- **first cook** · **tenth** · **fiftieth** (activity depth, additive, universal).
- **first stamp** (first travel cook) · **first dish from the Prophet's ﷺ table** (first `is_sunnah`).
- **a fully composed table** (a main plus its sides cooked within a window) — **content-gated**: depends on sides existing and, ultimately, on the Table remix feature; ships when that content lands, not before.

Milestones are surfaced as a small "marks earned" row (§4.5) and may also punctuate the Log at the moment earned. No locked/greyed future milestones are ever displayed.

## 7. The Atlas personal layer — the single explore-pull

The **only** forward pull, and it lives on `/atlas`, not in the book. A continuous map never reads as debt the way an enumerated grid of empty pages does.

- **Your world, lit.** Countries the cook has cooked carry their **earned stamp / a warm glow**; the unvisited world stays quiet, continuous geography — **never enumerated as missing.** This is an **overlay** on the existing density choropleth (personal pins/glow at country centroids), not a recolor of it.
- **One rotating "where next?" callout.** A single suggested region with uncooked recipes, framed as invitation ("wherever you go next"), fully skippable. One open door, deterministic per session, rotating over time. Never a per-country checklist.

This section is the home of the "collecting the world" motivation, drained of the debt.

## 8. Component inventory — reused vs. retired

**Reused (the craft survives whole):**
- Stamp rendering: `components/passport/stamps/*`, `CountryStampSlot`, `CancellationMark`, `PaperTexture`, `InkMark` family, `TierLedger` (relocated to §4.4).
- Logic: `lib/passport.ts` (`summarizeStamps`, titles, `computeTitle`), `hooks/useCookedStamps` (add a reverse-chronological entry list + per-entry derivations), `lib/cancellation-traits.ts`, `lib/stamp-traits.ts`, `lib/passport-stamps.ts` (`CUSTOM_STAMPS`).
- Per-country recipes on stamp tap: `StampedRecipesModal`.

**Retired (the booklet paging engine — the box, not the stamps):**
- `BookletShell`, `SpreadView`, `PassportBooklet`, `usePassportSpreads`, `useBookletNav`, `packRegion` (`lib/passport-pack`), `EmptyRegionSpread` + `RegionMotif` + `lib/passport-empty-copy` (empty region spreads are the debt; gone), `RegionChipStrip` / `RegionChip`, `CoverPage`, `ContentsSpread`, `InsideFrontSpread`, `BackCoverSpread`, `PageTurnInkMark`, the passport-overlay open/close ceremony (`PassportOverlay`, `PassportModal`, `lib/passport-origin`).
- `PassportAffordance` in the navbar becomes a plain link to `/journal` (keep the prefetch-on-idle/hover pattern for the route + its assets).

Retirement can be staged: unused files may sit dormant until a cleanup pass rather than being deleted in the same change that ships `/journal`.

## 9. Data & voice

**Data:** all derived from `passport_stamps` (already tolerant of null `recipe_country` since phase 1) joined to recipes. No new columns, tables, writes, or migration for phase 3. Origin-less cooks appear in the Log and stats; they never earn a country stamp or advance a travel title (correct, not a gap).

**Voice & copy rules (carry from the parent spec §10):**
- ﷺ convention respected in all user-facing copy.
- Never fabricate a narration or ruling; derived lines make factual claims about the cook's own history only.
- **No em dashes in user-facing website strings.**
- Margin-notes voice: confident, warm, never preachy; empty/nascent states honest and in-voice, never apologetic UI-speak.
- iOS: any text input ≥ 16 px (no inputs are planned here, but the rule stands).

## 10. Phasing (design-once, ship-phased)

Each phase ships alone, gates on `npm run typecheck` + `npm run build`, and is built on its own branch off `main` (nothing touches `main` until reviewed). Visual iteration happens on a `/dev/journal` scratch route reviewed in the browser, per the project's workflow.

- **Phase 3a — the scroll.** `/journal` route · masthead + only-counts-up stats · the Log (every cook, derived per-entry margin notes) · Stamps collected with relocated titles/`TierLedger` · navbar affordance → link · retire the overlay open path. Ships the additive spine.
- **Phase 3b — the personality.** Reflections (pull-quotes) · milestone marks. Both pure-derivation.
- **Phase 3c — the pull.** Atlas personal layer (earned stamps lit) + one "where next?" callout.

## 11. Out of scope

- Editable/persisted personal notes (deferred; would be the app's second write path and a parent-spec §8 amendment).
- Any completion meter, collection seal ladder, or "X of N against the catalog" mechanic (rejected by §1–§2).
- The Table remix feature and its "composed table" content (parent spec phase 3, separate); the milestone that depends on it is content-gated.
- Deletion of the retired booklet files (optional later cleanup).
- Recipe detail / cooked-button visual work (separate TODO track).

## 12. Risks

- **Losing the "opening ceremony."** The booklet's ritual is a real charm we are trading away. Mitigation: a considered masthead + materials + a gentle open transition on `/journal`; the collectible feeling rides on the stamps, which survive intact.
- **Sparse-data blandness.** At 1–3 cooks the scroll must look intentional, not empty. Mitigation: the nascent state is designed as a real editorial element (§4.6), same discipline as the Table hero placeholder.
- **Reflection tone.** A derived observation that lands as smug or judgmental would violate §2. Mitigation: conservative thresholds, warm copy, review each line against the voice rules; only-when-true guarantees no nagging.
- **Two map surfaces.** The Atlas personal layer must not fight the density choropleth. Mitigation: personal glow/pins are an overlay, not a recolor; audit both themes.
