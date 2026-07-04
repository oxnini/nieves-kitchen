// data/pantry/_types.ts
//
// Source-of-truth shape for a hand-authored pantry entry. One file per entry
// in this folder default-exports a `PantryEntry`; `data/pantry/index.ts`
// assembles them into the ordered shelf. `_`-prefixed files (like this one)
// are helpers, matching the `data/recipes/_types.ts` convention.
//
// These are plain data modules: no `'use client'`, no React, so they import
// cleanly from both server and client components.

/** The five shelf groups, in shelf order (see `KIND_ORDER`). */
export type PantryKind =
  | 'grains & staples'
  | 'fruits & sweetness'
  | 'dairy & eggs'
  | 'aromatics & preserved'
  | 'meat & fish';

/** Group order on the shelf. `PANTRY` is sorted by this, then design order. */
export const KIND_ORDER: PantryKind[] = [
  'grains & staples',
  'fruits & sweetness',
  'dairy & eggs',
  'aromatics & preserved',
  'meat & fish',
];

export interface PantryEntry {
  slug: string;
  name: string;
  kind: PantryKind;
  /** 2 to 3 sentences, margin-notes voice. No em dashes. */
  note: string;
  /**
   * Present ONLY for foods that carry a prophetic narration. When present, both
   * fields are required: a `citation` may never be omitted for a `prophetic`
   * note.
   *
   * Trust rule (non-negotiable, same discipline as `lib/halal.ts`): every
   * `citation` is a real, verified reference checked against sunnah.com /
   * quran.com before it ships. Never invent a narration or a citation, and
   * never reword a narration into something the source does not actually say.
   * If a claim cannot be verified against its source, cut or reword it rather
   * than ship it on trust. The `ﷺ` glyph follows "the Prophet" / "his" inline,
   * with no parenthesised or English-expanded variant.
   */
  prophetic?: { note: string; citation: string };
  /** Flat-ink art asset, path under `public/pantry/`. */
  artSrc: string;
}
