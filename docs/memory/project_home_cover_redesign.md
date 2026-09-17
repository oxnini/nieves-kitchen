---
name: home-cover-redesign
description: "Home cover redesign + pantry plinths SHIPPED 2026-07-11 (commit b4f20e9); covers rotate via data/covers.ts append-to-publish"
metadata: 
  node_type: memory
  type: project
  originSessionId: 42a6d524-6b9c-4d18-b38d-cc64aea10844
---

**Approved 2026-07-10, spec review waived.** Full spec (local-only, gitignored dir): `docs/superpowers/specs/2026-07-10-home-cover-redesign-design.md`. Mockup artifact (pills A-E, E approved): https://claude.ai/code/artifact/58511ed2-9390-42e9-908a-821874d7e329

Key decisions, learned through 5 mockup iterations:
- **Hero = variant E "card on the table"**: 3.5:1 photo/rail split (~84rem container), nameplate + tagline on photo (cream, top scrim only), cover story on a **locked-parchment paper card overhanging the photo's bottom edge** (ink #1E4854, dateline "On the table · Month Year" over double ledger rule, solid terracotta "Cook it tonight" + ink-outline "Browse all recipes"). Utility rail on parchment: Collections dot-links, More to cook (derived, 2 latest non-cover), 3 pantry plinth chips.
- **Rejected**: full-viewport all-photo hero (v2), frosted-glass panels (variant D). User's rule confirmed: overlays must be paper, never glass; text on paper, not on photos. Magazine jargon rejected too ("The Comfort Issue", "Issue No." → "On the table this month", "Where Next", "Until the next table").
- **Rotation**: `data/covers.ts` (replaces table-spreads.ts), append-to-publish, `{ publishedOn, recipe, whereNext }`, no kicker/coverLines fields. Seed with chinese-prawn-spaghetti.
- **Navbar goes global flush band**: floating pill → full-width parchment band, backdrop-blur, hairline bottom border, 2px active underline; keep useHideOnScroll.
- **Plinths**: `--color-plinth: #F5F0E4` locked token (no sepia override, like scrim); wrapper `bg-plinth rounded-xl ring-1 ring-brown-dark/8` + padding at PantryTeaser/EtchedCard/EntryOverlay.
- Retires: Masthead.tsx, TableSpreadHero.tsx, table-spreads.ts; collections cards leave home (rail carries them).
- Build path: /dev/home-cover sandbox first, then promote (see [[visual-iteration-workflow]]).

**SHIPPED 2026-07-11** (commit `b4f20e9`, after visual sign-off on /dev/home-cover): promoted to app/page.tsx, navbar swapped to the flush band, Masthead/TableSpreadHero/table-spreads.ts deleted. Plan (local, gitignored): `docs/superpowers/plans/2026-07-10-home-cover-redesign.md`.
- Cover photo: user picked a new Unsplash stand-in (Babs Gorniak, `photo-1673789274287-5441868398cc`, 2400px) over the original; written to the recipe row + seed file. Still a stock stand-in — swap to a real kitchen photo of the prawn spaghetti when one exists (recipes:check flags it).
- `/dev/home-cover` kept as the cover-photo audition surface (`?img=` picker; `CoverHero` has a sandbox-only `imageOverride` prop).
- To publish a new cover: append one object to `COVERS` in `data/covers.ts`; dateline/end-mark month and the Where Next line derive from it.
- EtchedCard kept its hairline border alongside the plinth (deferred judgment call; user didn't object at review).
- Teal & Ember palette got its own commit (`8ec0305`) just before this shipped.
