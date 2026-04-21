# Passport: Tier Ledger & Stamp Variation

**Date:** 2026-04-22
**Scope:** Two focused changes to the passport booklet — revamping the traveler profile page and adding visual variety to country stamps.

---

## Feature 1: Vertical Tier Ledger (Traveler Profile)

### Problem

The inside front spread's left half contains a "How this works" onboarding section (3 numbered steps) that duplicates the help modal accessible from the back cover button. The existing tier system (New Explorer → Culinary Diplomat) is shown only as a text heading and a one-line "next tier" hint — there's no visual sense of the full progression journey.

### Solution

Replace the "How this works" section with a **vertical tier ledger** — a stack of all 5 explorer tiers styled as visa checkpoint entries in the passport's postal aesthetic.

### What stays

- "Traveler profile" subheading
- Title rendered as the main heading (e.g. "Globetrotter")
- 3-stat row: Stamps / Countries / Regions
- Next-tier progress hint text (e.g. "2 stamps and 1 region to go")
- Right half of the spread (Contents / region table of contents) — untouched

### What changes

The `OnboardStep` list (lines 75–84 of `InsideFrontSpread.tsx`) is removed and replaced with the tier ledger component.

### Ledger design

A vertical list of all 5 tiers, top to bottom:

| Tier | Requirements |
|------|-------------|
| New Explorer | 0 stamps, 0 regions |
| Curious Cook | 1 stamp, 1 region |
| Wanderer | 5 stamps, 2 regions |
| Globetrotter | 10 stamps, 4 regions |
| Culinary Diplomat | 20 stamps, 10 regions |

**Each row contains:**

- **Tier title** in Cutive (stamp font), uppercase, tracked
- **Requirements** in compact form (e.g. "10 stamps · 4 regions") in body font, smaller
- **State indicator:** a small seal/checkpoint mark

**Visual states:**

- **Completed tier:** Seal is filled (terracotta). Text at full opacity. A dotted vertical connector line runs down to the next row.
- **Current tier:** Highlighted with a subtle warm background tint (e.g. `bg-terracotta/8`). Seal is prominent. This is the "you are here" marker.
- **Locked tier:** Text muted (`text-brown-medium` at reduced opacity). Seal is an empty outline. Requirements still visible so the user knows what's ahead.

**Styling principles:**

- Dotted vertical connector line between rows — postal/ledger feel
- Cutive monospace for tier titles, Figtree for requirements
- **Generous whitespace** between rows and around the ledger. This should breathe — not feel like a dense form or a crammed progress tracker. The passport aesthetic is spacious and considered.
- The ledger should feel like a page from a stamped travel document, not a SaaS dashboard

### Component changes

- `InsideFrontSpread.tsx`: Remove the "How this works" section. Add a new `TierLedger` component in its place.
- New component: `components/passport/TierLedger.tsx` — receives `PassportSummary` (which already contains `title` and `nextTier`), renders the 5-tier vertical list.
- `lib/passport.ts`: No changes needed — `EXPLORER_TITLES` already exports the full tier list with requirements.

---

## Feature 2: Country Stamp Variation

### Problem

Every `CountryStampSlot` is an identical circle at `--stamp-size` with a double-ring border. The only variation is a slight pseudo-random rotation. When a region page fills up, it looks monotonous — nothing like a real passport's diverse collection of stamps.

### Solution

Each country gets a **deterministic, unique stamp appearance** drawn from a rich pool of visual traits. A hash of the country name selects the combination, so the same country always looks the same.

### Trait axes

**Shape (8+ variants):**
- Circle
- Rounded rectangle (landscape orientation)
- Rounded rectangle (portrait orientation)
- Oval (landscape)
- Oval (portrait)
- Hexagon
- Triangle
- Diamond
- Wide pill

**Size bucket (3 levels):**
- Small: ~0.85× base `--stamp-size`
- Medium: 1.0× (current default)
- Large: ~1.15× base `--stamp-size`

The size range is intentionally subtle. Enough to notice variety, not enough to create jarring differences or break page rhythm.

**Border style (3 variants):**
- Solid
- Dashed
- Dotted

**Border weight (2 variants):**
- Thin — delicate, understated
- Medium — official, bold

**Inner detail (varies by shape):**
- Single outer ring only
- Double ring (current default — kept for some shapes)
- Single ring with corner accents/ticks (good for rectangles)
- Single ring with subtle inner frame

### What stays per stamp

- Country name: heading font, uppercase, tracked
- Date: body font, smaller, month + year format
- ×count for repeat cooks
- Paprika ink color (`text-paprika/90`)
- `stamp-ink` SVG filter + `mix-blend-multiply`
- Pseudo-random rotation angle (derived from country name hash)

### Determinism

All traits are derived from a stable hash of the country name string. The same country always produces the same shape/size/border/detail combination regardless of when it was earned or which device renders it. The existing `angleForCountry()` hash function in `CountryStampSlot.tsx` can be extended or a shared hash utility created.

### Layout changes

**Current:** `RegionHalf` uses a strict 3-column CSS grid with `gridTemplateColumns: repeat(3, var(--stamp-size))`.

**New:** Shift to a **flexbox flow layout** with `flex-wrap`, centered alignment, and consistent gaps. Stamps of varying widths and heights sit more organically while still flowing roughly 3 across. The visual result is a looser, more collected feel.

**Packing capacity unchanged:** The size differences are subtle enough that the current `HALF_CAPACITY = 12` and `SPREAD_CAPACITY = 24` in `passport-pack.ts` remain valid. We are not changing how many stamps fit per spread — only how they look within their space.

### Component changes

- `CountryStampSlot.tsx`: Major rework. Instead of a single hardcoded circle with double ring, it reads traits from a hash and renders the appropriate shape, border, and inner detail. The component's outer dimensions adapt to the size bucket and shape aspect ratio.
- New utility: `lib/stamp-traits.ts` — exports a `getStampTraits(country: string)` function that returns `{ shape, sizeBucket, borderStyle, borderWeight, innerDetail }` from a deterministic hash.
- `RegionHalf.tsx`: Change the stamp grid from `display: grid` with fixed columns to `display: flex` with `flex-wrap` and centered content.
- `passport-pack.ts`: No changes.

---

## Files touched (summary)

| File | Change |
|------|--------|
| `components/passport/InsideFrontSpread.tsx` | Remove onboarding section, add `TierLedger` |
| `components/passport/TierLedger.tsx` | **New** — vertical tier ledger component |
| `components/passport/CountryStampSlot.tsx` | Rework to support multiple shapes/sizes/borders |
| `components/passport/RegionHalf.tsx` | Grid → flexbox layout for stamps |
| `lib/stamp-traits.ts` | **New** — deterministic stamp trait hash utility |
| `lib/passport.ts` | No changes |
| `lib/passport-pack.ts` | No changes |

## Out of scope

- Positional jitter or random stamp placement — stamps flow in chronological order
- Per-region color tinting of stamps
- Changes to the right half of the inside front spread (Contents)
- Changes to the help modal, cover page, or back cover
