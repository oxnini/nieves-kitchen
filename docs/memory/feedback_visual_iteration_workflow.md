---
name: Visual iteration via scratch routes + A/B preview
description: For nieves-kitchen visual components, build a scratch route at /dev/<feature> that A/Bs old vs new and previews under production filters; iterate there before wiring into the real surface
type: feedback
originSessionId: 89c88272-5249-4688-a697-8bab82438466
---
When implementing a visually-sensitive component (e.g. passport stamps,
cancellations, map theming), set up a scratch route at `/dev/<feature>/`
that:

1. Renders the component standalone at a generously large size — large
   enough to judge typography and detail without squinting.
2. Renders it composited in production conditions — including any SVG
   filters (`[filter:url(#stamp-ink)]`), blend modes, opacity values,
   and parent wrappers it will live inside. Mount `<PaperTexture />` or
   equivalent so the filter defs exist on the scratch route.
3. Includes an A/B section when a SPEC rule is changing (old approach
   side-by-side with new) so the user can see the trade-off directly.
4. Includes edge cases: long text that truncates, short text, max
   parameter values (rotation extremes, etc.), and varied colour
   palettes / backgrounds the component will hit in production.

The scratch route is not linked from navigation — direct URL only.

**Why:** The user reviews visual work by eyeballing it, not by reading
diffs. The scratch route is the artefact she actually consumes. The user
iterated the cancellation component four times this way (size 28% → 40% →
46%; inner ring 70% → 55% → 40%; font Cutive Mono → Courier Prime Bold;
font size 4.6 → 6.4 → 8.5 → 9.5) — each change driven by visual review,
not abstract argument.

**How to apply:** Build the scratch route as soon as the component is
prop-driven enough to render with hand-faked data. Don't wait for real
data wiring before letting the user eyeball it. After each design
iteration, update the scratch route's intro paragraph to note what
changed, so the user can compare against the previous review.
