---
name: project_recipe_experience_revamp
description: Ordered 7-item plan from a /critique of the recipe surface (scored 27/40); tracks which items shipped
metadata: 
  node_type: memory
  type: project
  originSessionId: 4ddbc186-8740-410d-8c49-b840e9b350f3
---

A /critique audit of the recipe-detail surface scored it 27/40 and produced a 7-item ordered fix plan. Milestone tone for the whole revamp: "animated and satisfying but not overdone."

Status as of 2026-07-08:
- #1 Modal top bar — SHIPPED (RecipeDetail `heroBleed` prop; hero bleeds to container edges; meta line lifted to its own row; RecipeModal scrim chips + mobile grabber row).
- #2 Cook-mode entry — SHIPPED (`components/recipe/CookModeEntry.tsx` ticket bar replaced CookModeToggle).
- #3 Timer redesign — SHIPPED. New `components/recipe/PageTimerStrip.tsx` (on-brand: parchment, terracotta rule, font-stamp, ◷) co-located at the top of `StickyStepCard`. Deleted `PageTimer.tsx`, `TimerPanel.tsx`, `MiniTimerStamp.tsx` (mirror duality collapsed). Idle chips are the recipe's own detected step durations (`detectDurations` aggregated in RecipeDetail) + custom. `usePageTimer` now persists to localStorage (`nieves-page-timer`) and rehydrates on mount so it survives reload/navigation; the mode→read auto-reset was removed so a running timer is a background utility that keeps counting and rings on return. Web can't ring a locked-phone/closed-browser alarm; mitigation is the existing cook-mode wake lock. Done animation is a single settle (no infinite loop).
- #5 Supplementary cards — PENDING. Variations/Substitutions/Storage/Tips are four identical `bg-surface rounded-2xl p-5` boxes in RecipeDetail; differentiate typographically instead of stacked cards.
- #6 Browse card metadata — SHIPPED (2026-07-10). RecipeCard.tsx: footer is now time · calories (dropped "protein" fitness slot). Country/region + Fusion moved to a single on-photo dateline pill (country in brown-dark font-semibold, Fusion in text-turmeric/gold uppercase). Cooked no longer on the image (washed out on dark photos) — now a solid terracotta+text-parchment font-stamp "✓ COOKED" chip in the footer, plus a subtle `ring-1 ring-terracotta/35` on the whole cooked card (glanceable in a grid). Favorite heart moved to top-right. Overlays thinned from 4 → 2 (dateline + heart). Applies to featured card too. User picked "Variant 2 / Option A" over kicker+blue alternatives via the /dev/card-metadata A/B harness (now deleted).
- #7 Final /polish pass — SHIPPED (2026-07-10). Reviewed every revamp-touched file. Fixes: (1) global reduced-motion via `<MotionConfig reducedMotion="user">` in Providers (previously only WorldMap + PassportModal honoured it; now all framer-motion does); (2) "Copy Recipe" → "Copy recipe" in RecipeDetail hero for sentence-case consistency with "Copy ingredients". Verified-good (intentional, left as-is): stamp/postal elements use warm `text-parchment` while standard accent buttons use app-convention `text-white` (sepia-overridden); `duration-250` compiles under Tailwind v4 bare-value; focus-visible outlines consistent; cooked ring not clipped by overflow-hidden; hero-bleed negative margins match container padding exactly. Flagged as optional (NOT done, await user): StickyStepCard `transition-all` could be scoped; card favorite-heart has no SR label; SupplementarySections heading 22px/terracotta/bold vs main 24px/brown-dark/semibold is deliberate but divergent.

REVAMP COMPLETE: all 7 items shipped. Commits on main: #5 71ff685, #6 e8d08d0, #7 45b961a.

Do items one at a time with the [[feedback_visual_iteration_workflow]] (/dev/<feature> A/B route, visual review, then port + delete harness). See [[feedback_no_em_dashes]].
