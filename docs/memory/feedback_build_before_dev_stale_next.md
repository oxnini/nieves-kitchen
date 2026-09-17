---
name: feedback_build_before_dev_stale_next
description: Running npm run build before npm run dev leaves a stale .next that 404s CSS; dev renders unstyled
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8bdeea03-3e90-4110-a53e-5a18a7056dec
---

Running `npm run build` (production) and then `npm run dev` in the same repo leaves `.next` in a state where the dev server's global CSS asset (`/_next/static/css/app/layout.css?v=...`) **404s**, so every page renders completely unstyled (Arial/Times, no tokens). It looks like a broken component but it is a stale-artifact problem.

**Why:** build and dev share the `.next` directory; the production build's manifests don't match what dev expects.

**How to apply:** When eyeballing a dev route after a CI-parity `npm run build`, restart dev clean: `pkill -f "next dev"; rm -rf .next; npm run dev`. Verify the CSS link resolves 200 before trusting a screenshot (`curl -s <page> | grep -oE 'href="[^"]*\.css[^"]*"'` then curl that href). Relates to the headless-screenshot gotcha in [[project_courtyard_production_rollout]] — a faithful dev capture needs viewport height = full page scrollHeight (or captureBeyondViewport), else below-the-fold content is blank white.
