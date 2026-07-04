# Phase 2 Pantry — implementation plan

**Design:** `docs/superpowers/specs/2026-07-04-pantry-design.md` (parent: revamp spec §7).
**Picks (2026-07-04):** card treatment = **variant D "etched"** (outline card, no filled surface; the A x C hybrid the user requested); ﷺ glyph confirmed. **Still blocked on:** the seal mark — five candidates at `/dev/pantry` (rosette leads, user not fully convinced). Steps 1–3 and 6–8 can start now; steps 4–5 need the seal confirmed.
**Gates per step:** `npx tsc --noEmit` + `npm run build` (never `npm run lint`). Visual steps get a browser pass in both themes, desktop + mobile widths.

## 1. Data module — `data/pantry/`

- `data/pantry/_types.ts`: `PantryEntry` with `slug`, `name`, `kind` (the five-group union), `note`, optional `prophetic: { note: string; citation: string }` — citation required whenever `prophetic` exists (type-enforced, same discipline as `lib/halal.ts`), `artSrc` (path under `/pantry/`).
- One file per entry (9 launch entries from the design §2), `data/pantry/index.ts` exporting the ordered list + `pantryBySlug()`.
- Copy rules enforced by review: margin-notes voice, no em dashes, ﷺ glyph convention.
- **Citation verification step:** check all four prophetic citations against sunnah.com; anything unverifiable is cut or reworded, never shipped on trust.

## 2. Recipe wiring — `featuredIngredients`

- Add pantry slugs to the six real recipe files (garlic → aglio-e-olio, prawn-spaghetti, turkish-eggs; olive-oil → aglio-e-olio; eggs/yoghurt/butter → turkish-eggs; lamb → xinjiang-lamb-dumplings; review each file's ingredient list before finalising).
- Reseed Supabase (service key in `.env.local`; per the seed-for-the-cook rule Claude runs verify/seed/idempotency itself).
- Update the `/writerecipe` skill template: `featuredIngredients` field + pointer to the pantry slug vocabulary.

## 3. Ink art — 9 assets

- Draft one Sora prompt per entry from the canonical stamp boilerplate (flat two-tone ink on transparent, no material language, no faces; lamb as a cut). Composition briefs = the `/dev/pantry` placeholder sketches.
- User renders; ingest via the stamp pipeline (alpha check with `sips`, PIL white-key at 8–12% fuzz if needed, `cwebp`) into `public/pantry/<slug>.webp` (pre-commit hook: add `public/pantry/` to `AUTO_CONVERT_DIRS`).
- Until real art lands, `/pantry` can ship behind the dev route only — the public route ships **with** the art (no placeholder assets in production, per the phase 1 amendment precedent).

## 4. `/pantry` route (consumes the pick)

- `app/pantry/page.tsx` server shell (metadata) + client shelf component; transplant the winning variant + seal from `app/dev/pantry/` with production `data/pantry` + `next/image` for the art.
- Entry overlay per design §5; focus trap + Escape + backdrop close; mobile full-width card.
- Navbar: add Pantry (Home · Recipes · Pantry · Atlas · About · Halal).
- Delete or keep `/dev/pantry` as archive (convention: keep, it is unlinked).

## 5. Home pantry-shelf teaser (consumes the pick)

- New home section between the collections row and Latest: 6–8 ink stamps (sealed where prophetic) linking to `/pantry`, headline in the margin voice. Reuses the shelf card's art treatment at teaser scale.

## 6. FilterPanel collections

- "Collections" section in both FilterPanel variants (map + fab/list): four single-select chips writing `?collection=` on `/recipes` (param handling already live); navigating from the map variant routes to `/recipes?collection=…`; travels chip links to `/atlas`.
- Active chip styled with `COLLECTION_ACCENTS`; count badge from `Collection.includes` over the loaded recipe list.
- Check `countActiveFilters` interplay: collection is a preset, not a filter — decide whether it increments the badge (proposal: no; the shelf header already announces it).

## 7. Verification

- Browser pass: shelf both themes, overlay with and without prophetic block, zero-recipe state, cook-with-it links into the recipe modal, FilterPanel chips round-trip with the shelf header, home teaser links.
- Mobile: iOS input-zoom rule not applicable (no inputs); tap targets ≥ 44px on cards and chips.
- `npm run typecheck` + `npm run build` at the end of every step.

## 8. Bookkeeping

- TODO.md: check off the Pantry phase 2 item; queue second-batch entries (pumpkin, vinegar, black seed, milk) as a content reminder.
- Fold any schema-adjacent notes into CLAUDE.md (data/pantry module, public/pantry art dir, AUTO_CONVERT_DIRS addition).
- Phase 3 remains parked (Cook's Journal; dedicated Sunnah page decision revisits once the marked Pantry is live).
