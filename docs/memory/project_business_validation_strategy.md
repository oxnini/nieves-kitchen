---
name: project_business_validation_strategy
description: Nieves Kitchen positioning as trusted home for global halal cooking; artisanal-now validation strategy
metadata: 
  node_type: memory
  type: project
  originSessionId: 180cf7d8-eedc-4bac-b60f-688c18ae3dfd
---

User is exploring whether Nieves Kitchen (a passion-project halal recipe + world-map site) could become a real, impactful, fundable product. Posture: **validate before betting**, with time + willingness to interview users. UK-based, so UK-first market.

Full plan: `docs/superpowers/specs/2026-06-06-business-validation-strategy-design.md` (this folder is gitignored, local-only).

**Positioning wedge:** "the trusted, beautifully-made home for global halal cooking" (not a generic recipe finder, which is a graveyard). Halal-first is the market; the existing passport/stamp identity amplifies it.

**Key decisions locked:**
- "100% halal" is universal -> state site-wide, never badge per-recipe (a per-recipe badge was built then removed as redundant). The `/promise` page is the anchor; nav "Halal" link surfaces it. See `app/promise/page.tsx` + `lib/halal.ts`.
- "Kitchen-tested" = two promises: halal (universal) AND *recipe actually works* (the real moat). Reliability is the durable advantage.
- **Artisanal now, scale the kitchen later, never lower the quality bar.** Stay founder-cooked-only through validation; ~40-60 great recipes + retention is the signal, not a filled map. If scaling later, add vetted cooks meeting the same standard (honestly labelled), never untested recipes for breadth. No tier UI built yet.
- Honest methodology voice on the promise page (research from trusted sources, vegan/veg clears most concerns but still check alcohol + additives, "still learning, will correct").
- Ingredient guide in `lib/halal.ts` is a scaffold: every entry `needsSource: true` until a real sourced-research pass attaches citations. Never invent rulings/citations.

**Revenue (later, after love proven):** halal brand sponsorships + affiliate commerce near-term; consumer subscription mid; commerce/grocery layer is the venture-scale prize.

**Done 2026-06-07:** ingredient guide now sourced/cited (IFANCA + fatwa refs, `needsSource:false`); `/promise` voice made confident (no hedging) + sells taste/love; Track A interview kit written (`docs/superpowers/specs/2026-06-07-track-a-interview-kit.md`, lean ~8-12 chats, focused on finding the "explorer" demographic since many cooks already know halal).

**Deferred until more real recipes exist (decided 2026-06-07):** retention analytics (Track C) AND the acquisition-channel test (Track B item 3) are both **paused**. Reason: only ~2 real founder-cooked recipes so far (rest are mock). Retention/acquisition both presuppose enough real depth to hold people; measuring return or driving strangers to a mostly-mock catalogue would be noise and would burn a channel. Revisit both once the real-recipe catalogue is meaningfully bigger. The real bottleneck right now is **content velocity (authoring more real recipes)**, per the strategy doc's open risk.

**Still open / not yet done:** inline ingredient flagging on recipes (Layer 3b) — works regardless of recipe count, deepens the /promise trust wedge inside the cooking flow. And the ongoing work of adding real recipes (see [[feedback_seed_for_the_cook]]).

Related: [[feedback_halal_no_alcohol]], [[feedback_no_em_dashes]].
