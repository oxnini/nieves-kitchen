# Retired: the culinary passport booklet

**Retired:** 2026-07-05 · **Parked (route moved to `/dev/passport`):** 2026-09-03
**Replaced by:** the Cook's Journal at `/journal`
**Authoritative design:** `docs/superpowers/specs/2026-07-05-cooks-journal-design.md` (§1-§2 rationale, §8 file-by-file inventory) and `docs/superpowers/specs/2026-07-06-cooks-journal-edition-2-design.md`

> **Read this before building on anything under `components/passport/` that is not in the "still live" list below.** The booklet is parked, not deleted, and the files still compile. That is deliberate, and it is also exactly how a past session mistook it for live work.

---

## Why it was retired

Not craft. Shape.

A passport presents a **fixed, complete universe** (all 11 regions, every country) and shows the cook that most of it is blank. A pre-drawn grid of empty slots reads as **debt**, a to-do list nobody asked for. Every empty country is a quiet "you haven't done this."

The journal is the anti-passport: it starts empty and only ever holds what you actually cooked, so nothing is ever "missing." The governing rule, set 2026-07-05:

> Never show an empty slot or an unearned badge. The book only ever contains what the cook actually did, described warmly. Patterns are discovered in hindsight, never displayed as a checklist to complete.

Two secondary reasons reinforced the container change: the Log is an infinite feed and infinite feeds fight pagination, and page-flipping is a poor mobile gesture (the 3D flip was rejected outright; the 2D transition mostly just hid content behind a click).

## What must never come back

These are not neutral parked code. They are the exact mechanic the redesign existed to remove. If the booklet is ever revived, revive it **without** them:

- `EmptyRegionSpread`, `RegionMotif`, `lib/passport-empty-copy.ts` — empty region spreads *were* the debt.
- `ContentsSpread`'s enumerated region index (every region listed with a cooked count, including zeroes).
- Any per-collection completion ladder (Sunnah / Sides / high-protein "you're incomplete" meters). Separately and repeatedly rejected: they tell a non-Muslim cook, or anyone who simply cooks other things, that they are incomplete on parts that were never theirs.

The *universal* linear title ladder is fine and already lives on the journal (`JournalRank`) — it is not "parts that aren't yours."

## Still live — do not move, rename, or delete

The stamp craft never left. The journal imports all of this today:

| Module | Used by |
|---|---|
| `components/passport/stamps/*` (incl. `shared`) | `JournalStamps`, `CountryStampSlot` |
| `components/passport/CountryStampSlot.tsx` | `JournalStamps` |
| `components/passport/CancellationMark.tsx` | `CountryStampSlot`, `/dev/cancellation` |
| `components/passport/StampedRecipesModal.tsx` | `JournalScrollView` |
| `components/passport/PaperTexture.tsx` | `app/journal/page.tsx` |
| `components/passport/PassportAffordance.tsx` | `components/Navbar.tsx` (now a plain link to `/journal`) |
| `lib/passport.ts`, `lib/passport-stamps.ts`, `lib/stamp-traits.ts`, `lib/cancellation-traits.ts`, `lib/passport-recommend.ts` | journal + atlas + cooked button |

`PassportOverlayProvider` stays mounted in `components/Providers.tsx` because `PassportBooklet` calls `usePassportOverlay()` and would throw without it. Nothing calls its `open()` any more.

## Parked — booklet only

Reachable only via `/dev/passport` (404s in production through `app/dev/layout.tsx`):

`PassportBooklet`, `BookletShell`, `BookletLoading`, `SpreadView`, `Spread`, `CoverPage`, `InsideFrontSpread`, `ContentsSpread`, `BackCoverSpread`, `EmptyRegionSpread`, `RegionHalf`, `RegionMotif`, `RegionChip`, `RegionChipStrip`, `TierLedger`, `InkMark`, `CloseInkMark`, `HelpInkMark`, `PageTurnInkMark`, `PassportHelpModal`, `PassportModal`, `PassportOverlay`, `PassportIcon`, `hooks/useBookletNav`, `hooks/usePassportSpreads`, `hooks/useFocusTrap`, `lib/passport-pack.ts`, `lib/passport-empty-copy.ts`, `lib/passport-origin.ts`.

Three of these are also referenced by other dev sandboxes, so a naive delete would break them: `CoverPage` (`/dev/passport-cover`), `TierLedger` (`/dev/journal`), `CancellationMark` (`/dev/cancellation`).

## Worth salvaging if you ever want it

**`TierLedger`'s `JourneyMap`** is the one piece of real craft the journal has no equivalent of: a hand-authored SVG with per-tier coordinates (`TIER_POSITIONS`) and four bezier `SEGMENTS`, animating a progress path along a wandering route. `JournalRank` replaced it with a type-first ladder because the flat tier-badge WebPs were rejected and type-first was chosen. If the journal's rank block ever wants visual craft again, this is where to look first. Note `TierLedger` also carries a separate mobile `CompactList` treatment.

## Known debt in the parked code

`computeTopRegion` at `components/passport/InsideFrontSpread.tsx:140` **duplicates** the top-region computation inside `buildJourneyRecap` at `lib/journal.ts:155`. The Edition 2 spec called for lifting it into `lib/journal.ts` and sharing it; the lift happened and the dead copy stayed behind. `lib/journal.ts` is canonical. If you revive `InsideFrontSpread`, delete its local copy and import the shared one.

## Where the booklet stood when it was parked

Verified 2026-09-03, so a revival does not start by re-solving solved problems:

- **Mobile already renders one page at a time.** `813abf8` (2026-04-21) sized the shell as a single portrait page (`MOBILE_PAGE_ASPECT = 0.72`, no spine), merged each region spread's two halves into one `RegionHalf`, stacked `InsideFrontSpread`/`ContentsSpread` into a single column, and gave `TierLedger` its `CompactList`. An old TODO asking for exactly this survived until 2026-09-03 because it was written the same day, just before the fix landed.
- **Unverified suspicion, never reproduced:** `Spread.tsx` wraps children in `h-full ... overflow-hidden` inside an aspect-pinned box, so a stacked mobile page taller than the box would be silently clipped with no scroll. Arithmetic on a 390x844 viewport suggested the inside-front page could overflow. Never confirmed against a real render (Turnstile blocks automated sessions, and the booklet needs one). Treat as a lead, not a fact.

## How to revive

1. `git mv app/dev/passport app/passport` (or leave it under `/dev` and just link to it).
2. Re-point `components/passport/PassportAffordance.tsx` (currently `href="/journal"`), or add a second entry point.
3. Decide what happens to `/journal` — the two are alternative homes for the same stamp data, and shipping both would ask the cook to keep a record in two places.
4. Re-read "What must never come back" above before restoring any spread component.
