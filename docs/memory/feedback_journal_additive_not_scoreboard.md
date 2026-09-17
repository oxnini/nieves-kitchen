---
name: feedback_journal_additive_not_scoreboard
description: "Cook's Journal design philosophy — additive, no empty slots / no per-collection completion grids; but AS OF 2026-07-06 the journal DOES carry linear title progression + one where-next card (Edition 2)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d5d66ed8-fa89-4f52-9542-3a82314eaafc
---

## 2026-07-06 amendment (READ FIRST — reverses part of the rule below)

The pure-mirror version shipped and felt **too austere**: the earned title ("Curious Cook") floated with no context, meaningless because the cook couldn't see the progression it sat on. The user chose to **bring progression onto the journal** ("Edition 2 — Traveler's Log"):
- A **type-first rank block** (no badge art — rejected the flat tier WebPs): title in mono + the full title ladder as passed → **current** → ahead + **two progress meters** (countries X/min · regions Y/min) toward the next title + an "N more countries and M region(s) to {next}" line. Tiers are two-dimensional (minStamps AND minRegions), so a single bar would lie.
- A **"Journey so far"** recap (first cook · most recent · top region · most cooked).
- **One** "where next?" card on the journal itself, sampled from `recommendNextRecipes()` (not only on the Atlas anymore).

So the "no 'N from next tier'" and "explore-pull only on Atlas" clauses below are **retired for the journal**. What SURVIVES: no empty region spreads, no grid-of-blanks, and **no per-collection completion ladders** (Sunnah/Sides/high-protein "you're incomplete" meters stay rejected — that was the real harm). The linear *universal* title ladder is fine because it's not "parts that aren't yours." Spec: `docs/superpowers/specs/2026-07-06-cooks-journal-edition-2-design.md`.

---

## Original rule (2026-07-05) — superseded in part by the amendment above

The Cook's Journal (phase 3 of the Table·Pantry·Atlas revamp) is governed by one rule, set with the user 2026-07-05:

**Never show an empty slot or an unearned badge. The book only ever contains what the cook actually did, described warmly. Patterns are discovered in hindsight, never displayed as a checklist to complete.**

**Why:** The passport feels wrong to the user not because of craft but because of its *shape* — it shows a fixed universe (all regions/countries) and displays mostly blanks, which reads as debt ("you haven't done this"). Per-collection seal ladders (Sunnah/Sides/High-protein completion meters) were explicitly REJECTED for recreating that flaw: they'd tell a non-Muslim (or anyone) they're "incomplete" on parts that aren't theirs. Different users use the site differently and must never feel obligated to fill every component.

**The resolution the user chose:** motivating vs guilt-inducing is "one open door ahead" vs "every closed door shown at once." Keep collecting joy, drop the ledger of what's missing.
- **The Journal = pure additive record**: dated Log of cooks, earned stamps only (no empty region spreads), and reflective "patterns the book notices" that surface ONLY what's true of you. Feels like the user made it.
- **The explore pull lives on `/atlas`, not in the book** (chosen over an in-book frontier card or in-book map): the Atlas gains a personal layer — cooked countries glow warm + hold their stamp, the rest is quiet open geography never enumerated as missing, plus ONE rotating "where next?" region suggestion. A continuous map never reads as debt the way an enumerated grid does.

**How to apply:** When designing/implementing any Journal or progression surface, reject completion percentages, locked-badge grids, "X of N" against a growing catalog, and "N from next tier" debt lines. Reflective, additive, retrospective only. Milestones are revealed AFTER earning, never shown as locked quests. Relates to [[project_table_pantry_atlas_revamp]], [[project_passport_audit]].
