/**
 * Per-country cancellation traits — see `docs/stamps/SPEC.md` §3, §6, §8.
 *
 * A cancellation is the small dated postmark stamped on top of a visa each
 * time the user cooks. Two things vary per country:
 *
 *   1. The **centre glyph** — an asterisk / fleuron / short crossbar chosen
 *      once per country (SPEC §3, §8 step 7). Fixed forever for that
 *      country so a stack of cancellations on, say, Italy all share the
 *      same centre mark.
 *   2. The **ink colour** — looked up via the country's `CulinaryRegion`
 *      and the per-region table in SPEC §6, so every cancellation in a
 *      region looks like it came from one ink pad.
 *
 * Everything else about a cancellation (ring shape, recipe title text,
 * date format, geometry) is universal and lives in
 * `components/passport/CancellationMark.tsx`.
 */

import type { CulinaryRegion } from './types';
import { CUSTOM_STAMPS } from './passport-stamps';

/**
 * Cancellation ink per `CulinaryRegion`, mirroring the SPEC §6 table.
 * Variables are declared in `app/globals.css` under `@theme`.
 */
const REGION_INK_VAR: Record<CulinaryRegion, string> = {
  'Western Europe': '--stamp-ink-terracotta',
  'Eastern Europe': '--stamp-ink-terracotta',
  'East Asia': '--stamp-ink-wine',
  'Southeast Asia': '--stamp-ink-brown',
  'South Asia': '--stamp-ink-navy',
  'Middle East': '--stamp-ink-wine',
  'North Africa': '--stamp-ink-navy',
  'Sub-Saharan Africa': '--stamp-ink-terracotta',
  'North America': '--stamp-ink-wine',
  'South America': '--stamp-ink-navy',
  'Oceania': '--stamp-ink-navy',
};

/**
 * Country (lowercase) → `CulinaryRegion`. Covers every country currently
 * in `CUSTOM_STAMPS` (`lib/passport-stamps.ts`). Used only by the
 * cancellation layer to look up the ink colour via `REGION_INK_VAR`.
 *
 * Why not import `COUNTRY_TO_SUBREGION` + `SUB_REGION_PARENT` from
 * `lib/regions.ts`?
 *   - Mexico and Jamaica: SPEC §6 explicitly lists them under
 *     **South America** ("Mesoamerica + Caribbean" sub-style, ink =
 *     Indigo), while `lib/regions.ts` groups them under
 *     `North America` for world-map purposes (because the
 *     `Central America & Caribbean` sub-region's parent is
 *     `North America`). The cancellation ink follows SPEC §6, not the
 *     map taxonomy — the SPEC is the source of truth for stamp behaviour.
 *   - Kazakhstan / Uzbekistan / Turkmenistan: SPEC §6 puts the Central
 *     Asian sub-group under **South Asia** (Suzani / felt fragment
 *     vocabulary, ink = Indigo). That matches `regions.ts`'s
 *     `SUB_REGION_PARENT['Central Asia'] = 'South Asia'`.
 */
const COUNTRY_TO_REGION: Record<string, CulinaryRegion> = {
  // Western Europe
  spain: 'Western Europe',
  italy: 'Western Europe',
  france: 'Western Europe',
  portugal: 'Western Europe',
  greece: 'Western Europe',
  belgium: 'Western Europe',

  // Eastern Europe
  hungary: 'Eastern Europe',
  poland: 'Eastern Europe',
  slovakia: 'Eastern Europe',
  croatia: 'Eastern Europe',

  // East Asia
  china: 'East Asia',
  japan: 'East Asia',
  taiwan: 'East Asia',
  'hong kong': 'East Asia',
  'south korea': 'East Asia',

  // Southeast Asia
  thailand: 'Southeast Asia',
  vietnam: 'Southeast Asia',
  indonesia: 'Southeast Asia',
  philippines: 'Southeast Asia',
  malaysia: 'Southeast Asia',
  singapore: 'Southeast Asia',

  // South Asia (incl. Central Asia sub-group per SPEC §6)
  india: 'South Asia',
  pakistan: 'South Asia',
  bangladesh: 'South Asia',
  'sri lanka': 'South Asia',
  nepal: 'South Asia',
  bhutan: 'South Asia',
  afghanistan: 'South Asia',
  kazakhstan: 'South Asia',
  uzbekistan: 'South Asia',
  turkmenistan: 'South Asia',

  // Middle East
  turkey: 'Middle East',
  lebanon: 'Middle East',
  iran: 'Middle East',
  'saudi arabia': 'Middle East',

  // North Africa
  morocco: 'North Africa',
  egypt: 'North Africa',

  // Sub-Saharan Africa
  ethiopia: 'Sub-Saharan Africa',
  'south africa': 'Sub-Saharan Africa',
  ghana: 'Sub-Saharan Africa',
  kenya: 'Sub-Saharan Africa',

  // North America
  'united states': 'North America',

  // South America (incl. Mesoamerica + Caribbean per SPEC §6)
  mexico: 'South America',
  jamaica: 'South America',
  peru: 'South America',
};

/**
 * Per-country centre-mark glyph. Picked once per country (SPEC §3 / §8
 * step 7) — asterisks, fleurons, and short crossbars only, drawn flat
 * at the centre of the postmark.
 *
 * Edit this map (not `CancellationMark`) when adding a new country.
 */
const CENTER_GLYPHS: Record<string, string> = {
  // Western Europe — fleurons + refined asterisks (editorial brown-ink visas)
  spain: '❦',
  italy: '✱',
  france: '❀',
  portugal: '❧',
  greece: '✤',
  belgium: '✻',

  // Eastern Europe — crossbars + folk asterisks
  hungary: '✥',
  poland: '❁',
  slovakia: '✜',
  croatia: '✲',

  // East Asia — clean asterisks (literati album-page visas)
  china: '✱',
  japan: '❋',
  taiwan: '✺',
  'hong kong': '✸',
  'south korea': '❉',

  // Southeast Asia — warm star-asterisks
  thailand: '✺',
  vietnam: '✸',
  indonesia: '❊',
  philippines: '✶',
  malaysia: '❈',
  singapore: '✷',

  // South Asia — folk-asterisks; Central Asia leans on crossbars/4-points
  india: '✜',
  pakistan: '❋',
  bangladesh: '✺',
  'sri lanka': '✸',
  nepal: '✦',
  bhutan: '✧',
  afghanistan: '❉',
  kazakhstan: '✲',
  uzbekistan: '❊',
  turkmenistan: '❈',

  // Middle East — geometric rosettes (Iznik tile / Bedouin cloth visas)
  turkey: '❀',
  lebanon: '❁',
  iran: '✦',
  'saudi arabia': '❃',

  // North Africa
  morocco: '✱',
  egypt: '✤',

  // Sub-Saharan Africa
  ethiopia: '✜',
  'south africa': '✲',
  ghana: '❉',
  kenya: '✺',

  // North America — engraved-postage feel
  'united states': '✷',

  // South America incl. Mesoamerica + Caribbean
  jamaica: '❋',
  mexico: '✺',
  peru: '❋',
};

const DEFAULT_GLYPH = '✱';
const DEFAULT_INK_VAR = '--stamp-ink-brown';

/**
 * Centre-mark glyph for a country's cancellations. Returns the default
 * heavy asterisk for any country not in the map (procedurally-stamped
 * countries without a custom visa).
 */
export function getCenterGlyph(country: string): string {
  return CENTER_GLYPHS[country.toLowerCase()] ?? DEFAULT_GLYPH;
}

// Dev-only coverage check. Any country with a custom visa (i.e. in
// CUSTOM_STAMPS) MUST also have entries in both maps above — otherwise
// its postmarks silently fall back to brown + ✱, which looks wrong
// against neighbouring countries' region-correct postmarks. The
// `ingeststamp` skill enforces this on new ingests; this guard catches
// anything that slips through.
if (process.env.NODE_ENV !== 'production') {
  const missing = Object.keys(CUSTOM_STAMPS).filter(
    (c) => !(c in COUNTRY_TO_REGION) || !(c in CENTER_GLYPHS),
  );
  if (missing.length > 0) {
    console.warn(
      `[cancellation-traits] Missing entries in COUNTRY_TO_REGION and/or CENTER_GLYPHS for: ${missing.join(', ')}. ` +
        `Postmarks for these countries will fall back to brown + ✱. ` +
        `Add them to lib/cancellation-traits.ts (see ingeststamp skill step 7).`,
    );
  }
}

/**
 * CSS variable *name* (e.g. `--stamp-ink-navy`) for the cancellation
 * ink colour on a given country's visa. Caller wraps with `var()`.
 * Returns the warm-sepia fallback for unknown countries.
 */
export function getCancellationInkVar(country: string): string {
  const region = COUNTRY_TO_REGION[country.toLowerCase()];
  return region ? REGION_INK_VAR[region] : DEFAULT_INK_VAR;
}
