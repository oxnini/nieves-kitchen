---
name: feedback_seed_for_the_cook
description: "After confirming a recipe, Claude should run the seed/verify/cleanup steps itself; the cook does not want to run them"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 06088fb2-a004-4372-8107-f80a163be191
---

For the recipe pipeline, once the cook has reviewed and approved a recipe, Claude should run the publish steps itself (`npm run recipes:verify`, `npm run seed:recipes`, the idempotency re-run, and removing the superseded mock row) rather than handing the cook a command list to run.

**Why:** The cook said "next time you can just run the steps for me after we finish confirming a recipe; I don't want to run these on my own." `SUPABASE_SERVICE_ROLE_KEY` is already present in `.env.local`, so Claude can seed the live DB directly.

**How to apply:** Per-recipe loop: cook pastes a recipe → Claude writes `data/recipes/<slug>.ts` → cook reviews/approves → Claude runs verify, seed, idempotency check, and deletes the matching `mock-%` row → cook does the browser eyeball. When a real recipe supersedes a mock, delete just that mock row (targeted), not the whole `mock-%` set; full cutover (`delete from recipes where slug like 'mock-%'`) is a later one-shot. Note this writes to the live/production Supabase. Relates to [[feedback_halal_no_alcohol]].
