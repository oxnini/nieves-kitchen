---
name: Per-region stamp enrichment, not blanket templates
description: When adding visual density to stamps, treat each region as its own project with region-specific density elements drawn from its visual heritage. Never apply one density template across all regions.
type: feedback
originSessionId: 05081149-ab7d-48d2-ac2b-031b87ee8e73
---
When stamps in a region read as too sparse / boring compared to the Western Europe anchor, the fix is **region-by-region**, not a blanket enrichment template across the file.

**Why:** Blanket additions (e.g. "every prompt gets fleurons + cross-hatch + postal cancellation circle") would homogenize all 13 ink-impression sub-regions into the same visual rhythm and erase the per-region distinctness that the cartouche + palette + border vocabulary is supposed to create. Treating W. Africa, Andean S. America, Caribbean, Arabian Peninsula, etc. as one big editing pass produces interchangeable stamps — the opposite of the cookbook/passport editorial intent in `CLAUDE.md`.

**How to apply:** When the user reports density issues with stamps, brainstorm density elements that come from *that specific region's* visual heritage:
- South Asia → paisley/floral inner borders, mandapa column detail, jali screen geometry as corner glyphs
- Arabian Peninsula → calligraphic flourishes, Islamic geometric tile fragments at corners
- W. Africa → Adinkra symbols as corner glyphs, kente strip-weave inner band
- E. Africa → Maasai bead-pattern inner ring, Coptic-cross fleurons
- Mesoamerica → glyph cartouches as corner stamps, stepped-fret inner band
- Caribbean → sextant/anchor postal marks, tropical-flora fleurons
- Andean S. America → tocapu (Inca textile glyphs) inner band, condor/llama silhouette fleurons
- Oceania → tribal-geometric corner marks, koru/tapa stamp fleurons
- N. Africa → Tifinagh letter glyphs at corners, mihrab niche inner detail
- SE Asia → lotus medallion inner mark, stupa silhouette fleurons
- (etc — adapt per region)

Pick one region at a time, propose 2–4 region-specific density elements, get sign-off, edit that region's prompts only, then move on. Do not batch.

**Anti-pattern:** "I'll add fleurons + cross-hatch + postal circle to every ink-impression prompt." If the same edit would land in every region's prompt, it's the wrong edit.
