---
name: feedback_halal_trust_voice
description: Voice + sourcing rules for halal trust copy on Nieves Kitchen
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 180cf7d8-eedc-4bac-b60f-688c18ae3dfd
---

Rules for any halal-trust / `/promise` copy and the ingredient guide on Nieves Kitchen:

- **Confident voice, no hedging.** Do NOT write "I'm still learning" or "tell me if I got it wrong" on user-facing trust copy. The user wants visitors to trust the site 100%. Hedging reads as unreliable. She guarantees every recipe is 100% halal before it goes up.
- **Sell the love + taste, not just "it works."** "Kitchen-tested" means she personally cooked it AND genuinely loves it AND it tastes phenomenal. Lead with that delight, not a dry "it's reliable."
- **Never fabricate halal rulings or citations.** (User explicitly said "remember this.") Every ingredient ruling must cite a recognised halal authority. Primary: IFANCA Halal Shopper's Guide (ifanca.org). Use published fatwa references (e.g. IslamQA) for specific items. Where scholars genuinely differ (e.g. vanilla extract trace alcohol), show BOTH positions with sources, don't pick for the user.

**Why:** the trust promise IS the product wedge; a single fabricated or shaky ruling destroys it.
**How to apply:** see `lib/halal.ts` (sourced `INGREDIENT_GUIDE`, `needsSource` flag) and `app/promise/page.tsx`. Related: [[project_business_validation_strategy]], [[feedback_halal_no_alcohol]], [[feedback_no_em_dashes]].
