---
name: project_redesign_language_exploration
description: 3 new /dev/redesign design-language candidates to pick ONE brand from; supersedes the old 6
metadata: 
  node_type: memory
  type: project
  originSessionId: 7ec7fe58-2501-483b-b17d-be38c35e52e9
---

Started 2026-07-13. User rejected the earlier six `/dev/redesign` variants as "too postcard-forward" and "not refined enough." Built **3 fresh design languages** to choose ONE from, which will then seed the whole brand going forward.

Grounded in `~/Desktop/inspo for NK` (three clusters: blue-white azulejo/Iznik tile; bold GOURMET/SALADS editorial poster + saturated food photos; sun-washed palette-swatch + watercolor postcards). Palette swatch `download.png` = Almond Cream #F0EAD8 / Coastal Sage #99ABA6 / Golden Chamomile #D2BF81 / Olive Grove #6F6C43 / Burgundy #5A0A28.

Files under `app/dev/redesign/v2/`:
- `Sunwashed.tsx` — illustrative, warm-minimal (user note: NOT too minimal); arched "sun-window" frame + watercolor/ink spot-art; Fraunces + Karla; the palette-swatch world.
- `Azulejo.tsx` — editorial cookbook on a REAL drawn cobalt tile system (SVG pattern bands + tile frames, not pasted-on ornament); DM Serif Display + Karla; cobalt/terracotta/brass.
- `GourmetPress.tsx` — bold poster; Anton type-as-architecture over full-bleed photos, hard colour blocks, press seal; navy/coral/marigold/emerald.
- `content.ts` (shared static data + `Rich` inline-nav prose type), `shared.tsx` (`Filmstrip` swipe carousel, `NavText`, `useNavFlash`/`NavFlash`).

Each variation ships **Home + Recipe** screens (toggle in dev bar). Shared UX spine held constant across all three (the usability layer): visible nav, filmstrip recipe carousel (drag+arrows+keyboard, user picked filmstrip over card-deck), and the **"the writing is the navigation"** cookbook recipe page (inline prose links → atlas/pantry/collection; in-sandbox they raise a "Opening … →" flash since there's no router). Old 6 demoted under a "legacy ▾" menu.

Spec: `docs/superpowers/specs/2026-07-13-redesign-language-exploration-design.md`.

Round-1 feedback (2026-07-13): preferred Azulejo's COLOURS + the "every country is a tile" idea; loved Sunwashed's ARCH + hero fonts/colours; liked Gourmet's "out of the oven" cards but it's too bold / too many colours and the full-bleed photo looks low-res. All homes felt same-y (big title + big image); wanted denser home, bolder nav, plainer copy (current copy "too forced/poetic").

→ Built **Courtyard** (`v2/Courtyard.tsx`, now the default ★ tab) as the SINGLE synthesis, per user pick:
- Azulejo palette (cobalt/terracotta/brass/cream) + Fraunces + Karla.
- **Arch** = signature frame (with brass keystone); used for hero + recipe image only (restraint).
- **Tile = brand primitive** (user committed): destinations are glazed tiles, method step-numbers are tiles, a "Journal — tiles earned" tile previews the passport-as-tiles idea. Atlas rebuild (tiled map) + passport stamps→tiles is a flagged LARGE downstream project, not done yet.
- Home = **magazine index** (chosen): title + Jump-in chips beside arched feature, then This-week filmstrip, then 4 destination tiles (Atlas/Pantry/Collections/Journal). Denser + more explorable.
- **Bold nav**: solid cobalt bar, larger tabs, brass active underline, terracotta Start-cooking.
- Contained imagery only (no full-bleed) to dodge low-res. Copy rewritten plain in content.ts (affects all variants). No em dashes.

NEXT: user reviews Courtyard at `/dev/redesign` (default tab). If approved → distill into real design language + apply to production (globals.css tokens, Navbar, home, recipe pages), then tackle atlas + passport tile rework. Only 4 real dish images exist so decks reuse them. Related: [[project_home_cover_redesign]], [[project_palette_exploration]], [[project_table_pantry_atlas_revamp]].
