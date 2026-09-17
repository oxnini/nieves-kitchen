---
name: recipes-commit-straight-to-main
description: Recipe ingestion does not need a feature branch or worktree; commit straight to main
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 04984cd0-6775-4d7e-aa14-60a0d7ceada9
  modified: 2026-09-10T23:03:46.850Z
---

Ingesting a recipe (authoring `data/recipes/<slug>.ts` + seeding) does **not** need a feature branch, a worktree, or a PR. Commit straight to `main`. Stated 2026-09-10 when I had branched `recipes/korean-smash-burger` off main out of a default "never commit to the default branch" habit.

**Why:** a recipe file is additive, self-contained, and already gated by `npm run typecheck` + `npm run recipes:check` before it is ever seeded. There is nothing for a review branch to catch, and the branch ceremony just adds steps between the cook and a live recipe. The PRs in the history (#5 Courtyard rollout, #6 pantry redesign, #7 soup/meatballs) were multi-file feature work, which is a different case.

**How to apply:** for `/writerecipe` and photo swaps, commit on `main` and skip the branch. Reserve branches/PRs for feature work that touches components, lib, or schema. Still never commit unless asked ([[feedback_seed_for_the_cook]] covers the seed side: Claude runs verify/seed, the cook does the browser check).
