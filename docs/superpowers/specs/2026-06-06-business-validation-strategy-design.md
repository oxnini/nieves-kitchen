# Nieves Kitchen — Business Validation Strategy

**Date:** 2026-06-06
**Status:** Strategy / validation plan (pre-build)
**Goal:** Honestly test whether Nieves Kitchen could become a real, impactful, fundable product, before betting heavily on it.

> This is not an implementation spec. It is the strategic frame and a 90-day validation plan. Individual product experiments (Track B) get their own design/plan docs when we build them.

---

## 0. Founder intent

- **Posture:** Validate before betting. Not committing to "go full-time startup" yet; want an honest test of whether there is a real business + impact here.
- **Appetite:** Has real time over the next 2-3 months and is willing to talk to / interview potential users (the gold standard for validation).
- **Decision wanted:** At the end of ~90 days, a clear "keep going / rethink / stop" call based on pre-agreed signals, not vibes.

### Decisions locked (2026-06-06)
- **Content/trust model:** "Kitchen-tested now, tiers later." Lead today with "every recipe personally cooked & halal-verified." Design the trust system so a future "Verified halal" contributor tier can be added without rework. Founder-tested depth > catalog breadth during validation. The tried-and-tested approach IS the verification methodology, not a limitation.
- **Differing scholarly opinions:** Handle honestly. For contested ingredients, show the differing positions with citations and let the user decide per their own practice. This respect-with-sources stance is itself a trust feature.
- **Geography:** UK-first. Channels, communities (UK halal cooking groups, UK Muslim food TikTok/Instagram, UCL + university Islamic societies), and brand-partner strategy all assume a UK starting market.

### Decisions locked (2026-06-07)
- **"100% halal" is universal; do not badge it per-recipe.** It is always true site-wide, so a per-recipe halal badge is redundant noise. State the promise loudly once at the site level (the `/promise` page, nav "Halal" link, and editorial surfaces) instead. The per-recipe trust badge was built and then removed for this reason.
- **Two kinds of trust, kept separate.** "Kitchen-tested" carries two promises: (1) it is halal [universal, handled site-wide] and (2) it is a *good recipe that actually works* [the real moat]. The reliability promise is the durable competitive advantage (the recipe internet's biggest failure is recipes that do not work).
- **Artisanal now, scale the kitchen later, never lower the bar.** Through validation, stay founder-cooked only. You do not need the world map filled to test whether people love it; ~40-60 genuinely great recipes + retention is the signal. Do NOT add untested recipes for breadth. If/when scaling, expand by bringing in vetted cooks who meet the same halal + quality standard (honestly labelled cooked-by-Nieves vs vetted), never by dropping the quality bar. No tier UI built yet; revisit only after love is proven.
- **Honest methodology voice.** The `/promise` page states the real process: research from trusted/authentic sources, vegan/veg clears most concerns but alcohol + a few animal-derived additives still get checked, "still learning, will correct mistakes." Humility + an invitation to be corrected is a trust feature, not a weakness.
- **Ingredient guide needs sourced research before it is authoritative.** Every entry is flagged `needsSource: true` in `lib/halal.ts` with a visible "still growing" caveat on the page. A dedicated, carefully-sourced research pass against recognised halal authorities is required before dropping the caveat. Do not invent rulings or citations.

## 1. The thesis (the one sentence everything hangs on)

> **Nieves Kitchen is the trusted, beautifully-made home where Muslim home cooks explore and cook the whole world's food, without the constant "is this halal?" anxiety.**

Three claims that must be true for this to be a business:

1. **Painful problem.** Halal home cooks face real, recurring friction:
   - *Trust:* "Can I actually eat this? Is this gelatin / vanilla / rennet / enzyme okay?"
   - *Discovery:* most "world cuisine" content assumes pork, alcohol, or non-halal ingredients, so exploring globally means constant translation and substitution.
   - *Quality:* the digital tools this audience is given are mostly low-effort SEO blogs and scattered social accounts.
2. **Underserved large market.** ~2B Muslims globally, fast-growing, high food spend, famously loyal to trusted sources. No beloved, well-crafted digital home for halal home cooking currently exists.
3. **Unfair advantage.** The founder *is* the user, has rare design taste, and has already built something with soul (the passport/stamp journey, editorial craft) that this audience is almost never offered.

### Why niche-first (the key strategic decision)
"General global recipe finder" is a graveyard: competing with NYT Cooking, Allrecipes, and Google, with no wedge and no reason to be funded. "The trusted, beautifully-made home for global halal cooking" is a real, undefended space the founder is uniquely positioned to own. Narrow to start; broaden later (Whole Foods began as one store). The existing "passport / travel through food" identity *amplifies* this rather than conflicting with it:

> *"Muslim home cooks can't easily explore world cuisines they can trust. Nieves Kitchen is the passport to global halal cooking."*

Tone guardrail: warm, editorial, welcoming-to-everyone. Not a narrow "religious app" feel.

## 2. Impact thesis (real, not a stretch)

- **Cultural preservation + transmission.** Diaspora families lose recipes across generations; a beautiful trusted archive of *global* halal home cooking is genuine cultural-heritage work.
- **Reducing daily friction + anxiety** for a huge population around a basic human need (what is safe to cook / eat).
- **Dignity through design.** Underserved audiences are usually handed ugly, low-effort tools; making something genuinely beautiful for them is a form of respect, and it is the founder's core strength.
- **Bridge, not silo.** "Travel the world through food you can trust" quietly counters the idea that halal eating is restrictive.

## 3. Revenue menu (monetize *later*, after love + retention are proven)

Do not monetize until people demonstrably love and return to the product. The menu exists so the investor story has a credible "how does this make money" answer.

| Tier | Model | Why it fits | When |
|---|---|---|---|
| Near-term | Halal **brand sponsorships / native content** (spice, sauce, meat-box, snack brands) | These brands have budget and no good way to reach engaged Muslim home cooks; high-intent audience = premium value. | After an audience exists |
| Near-term | **Affiliate commerce** ("where to buy this halal ingredient": specialty gelatin, rennet, spices, halal meat delivery); shoppable recipes | Solves a real user problem *and* earns. | After an audience exists |
| Mid-term | **Consumer subscription** (meal plans, collections, cook-mode, family sharing, ad-free) | Only works once the product is habitual; do not lead with it. | After retention proven |
| Big-vision | **Commerce layer**: "cook this -> buy halal-verified ingredients in one tap" (grocery/delivery integration) | The venture-scale TAM: becoming the discovery + transaction layer for halal food. | The real prize |
| Long-term | **B2B halal trust/verification**: the authority brands & restaurants rely on | Defensible moat if you own "trust." | Much later |

**Investable narrative:** consumer love now -> commerce/brand revenue later -> the halal food discovery + transaction layer. Audience first, money follows.

## 4. The 90-day validation plan

Three overlapping tracks. The goal is to *learn*, not to grow.

### Track A — Problem discovery (weeks 1-4): ~20-25 conversations
The highest-value activity. Use *The Mom Test* discipline: do not pitch, do not ask "would you use this," ask about past behavior.

- **Who:** Muslim home cooks via friends/family, MSA / Islamic society, halal cooking Facebook groups, r/halal, mosque communities, UCL network. Mix of ambitious cooks and weeknight cooks.
- **Questions (about their life, not the idea):**
  - "Walk me through the last time you wanted to cook something new. What did you do?"
  - "Tell me about the last time you weren't sure if an ingredient was halal. What did you do?"
  - "Where do you find recipes now? What annoys you about it?"
  - "Have you ever started a non-halal recipe and had to improvise? What happened?"
- **Listening for:** does trust/discovery pain appear *unprompted*? Do they describe workarounds (real pain)? Or shrug (not painful enough)?

### Track B — Product signal experiments (weeks 3-10)
Small, cheap changes to the existing site that test the thesis and double as interview demos:

1. **Make the halal-trust promise explicit and central** — homepage line + an "every recipe is halal, here's how we check" trust page. Test: do people respond to it?
2. **A lightweight "is this halal?" helper** for borderline ingredients (gelatin, vanilla extract, rennet, enzymes, etc.) — even a curated glossary/FAQ to start. Directly tests whether *trust* is the wedge.
3. **One real acquisition-channel test** — post 3-5 recipes as content to one halal cooking community / TikTok / Pinterest; watch whether anything spreads. Tests whether the audience is cheaply reachable.

Each Track B item that involves building gets its own shape/design pass before code.

### Track C — Retention signal (weeks 4-12)
The existing passport/stamp loop is ideal here. The decisive consumer-product question: **do people come back?**

- Add the lightest-possible, privacy-respecting analytics: do people return within 7 days? Do they cook (stamp) more than once?
- Watch whether the passport actually drives return visits or is just a pretty toy.

### Go / no-go scorecard (decide in advance)

| Signal | Keep going | Rethink / stop |
|---|---|---|
| Trust pain in interviews | Appears unprompted in >50% | People mostly shrug |
| Emotional pull | "where has this been?" / shared unasked | Polite "that's nice" |
| A channel that works | >=1 repeatable cheap way to reach users | Nothing spreads; all manual |
| Early retention | A real fraction return & cook >once | One-and-done visits |

**Honesty clause:** if trust pain doesn't surface and nothing retains, that is the validation *working*. 90 days spent instead of 3 years is the entire point.

## 5. What makes it investable (pitch shape, if scorecard is green)

1. **Problem:** ~2B people, daily trust + discovery friction, ugly tools.
2. **Insight / wedge:** trust is the unmet need; no *beloved* product exists here.
3. **Why you:** you are the user, you have the design taste, you've already built something with a soul + an audience that retains.
4. **Traction:** the 90-day numbers — interviews, retention, the channel that worked.
5. **Business:** audience now -> commerce/brand revenue -> halal food discovery + transaction layer (large TAM).

## 6. Immediate next steps

- [ ] Build the interview list + outreach messages + Mom-Test question script (Track A).
- [ ] Design + ship the halal-trust promise (homepage line + trust page) — Track B item 1 (own design pass).
- [ ] Design + ship the "is this halal?" ingredient helper — Track B item 2 (own design pass).
- [ ] Add privacy-respecting return/retention analytics — Track C.
- [ ] Pick one acquisition channel to test — Track B item 3.

## 7. Open questions / risks

- **Trust verification credibility:** to *own* trust long term, "every recipe is halal, here's how we check" must be a defensible process, not just a claim. Needs a real methodology eventually.
- **Content velocity:** a beloved cooking destination needs enough high-quality recipes; current catalog is small. How do recipes scale (founder-authored, curated creators, UGC)?
- **Geography:** ~~which market first?~~ Decided: UK-first (see Decisions locked).
- **Founder commitment:** this plan is validation; a green scorecard implies a real decision about time/commitment that is explicitly deferred for now.
