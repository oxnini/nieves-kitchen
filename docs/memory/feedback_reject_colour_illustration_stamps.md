---
name: reject-colour-illustration-stamps-flat-two-tone-ink-only
description: User considered then rejected full-colour illustrative food-badge stamps (Somalia/Ethiopia experiments); committed to flat two-tone ink-on-transparent as the single stamp grammar.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6d5f6128-27e1-4c7c-a5f1-c53dfeb6d557
---

On 2026-06-07 the user weighed two stamp directions side-by-side on `/dev/stamps-gallery` and **committed to flat two-tone ink-on-transparent as the one grammar** (the [[project_stamp_aesthetics_strategy]] canonical style). They explicitly rejected the full-colour illustrative "food-badge" look (a detailed colour plate-of-food inside a ring, on an opaque cream parchment disc) that had crept in via colour re-renders of Somalia and Ethiopia.

**Why:** Real passport stamps are ink impressions, not photos. The flat-ink style *is* the passport concept — it melts into the paper, postmarks sit naturally on top, and it reads as "stamped." The colour badges are gorgeous in isolation but read as a sticker/coin, were outliers (2 of ~60), don't tile into a coherent booklet next to flat-ink neighbours, and cost more per stamp (keying, masking, halo + size/scale fixes). Consistency at 50+ countries beats per-stamp beauty.

**How to apply:** Never render or ingest colour-illustration / opaque-substrate stamps. Hold the line on ink-on-transparent, two inks max, no substrate (no parchment disc, no full-colour fill). If a render arrives in the colour-badge style, flag it and re-render in grammar before ingesting (per [[feedback_spec_before_code]] / [[feedback_no_material_language_in_stamp_prompts]]).

**Fallout to clean up:** Ethiopia was restored to its committed flat-ink webp (the colour 1840×1826 working-tree version was discarded; `ethiopia` aspect reverted to `996 / 784`). Somalia's flat-ink asset was an untracked file that got overwritten by the colour render and is **unrecoverable from git** — `somalia.webp` is currently a colour placeholder, marked `[~]` in `docs/stamps/CHECKLIST.md`, awaiting a flat-ink re-render + re-ingest. `/dev/stamps-gallery` is the batch-review route (newly-added countries only).
