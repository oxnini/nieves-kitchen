'use client';

/**
 * Design sandbox data for /dev/pantry — the phase 2 Pantry design pass.
 *
 * Sandbox copies only: the approved shape moves to `data/pantry/*.ts` and the
 * inline SVG art is a stand-in for real flat-ink assets rendered through the
 * stamp ingest pipeline. Citations below are drafts of well-known narrations;
 * every one gets verified against sunnah.com before anything ships (halal
 * trust rule: never publish an unverified source).
 */

import type { ReactNode } from 'react';

export type PantryKind =
  | 'grains & staples'
  | 'fruits & sweetness'
  | 'dairy & eggs'
  | 'aromatics & preserved'
  | 'meat & fish';

export const KIND_ORDER: PantryKind[] = [
  'grains & staples',
  'fruits & sweetness',
  'dairy & eggs',
  'aromatics & preserved',
  'meat & fish',
];

export interface DevPantryEntry {
  slug: string;
  name: string;
  kind: PantryKind;
  /** 2 to 3 sentences, margin-notes voice. No em dashes. */
  note: string;
  /** Present only for prophetic foods; citation is structurally required. */
  prophetic?: { note: string; citation: string };
  /** Recipe slugs for "Cook with it" (final home: recipe.featuredIngredients). */
  recipeSlugs: string[];
}

export const DEV_PANTRY: DevPantryEntry[] = [
  {
    slug: 'barley',
    name: 'Barley',
    kind: 'grains & staples',
    note: 'The grain of talbina, simmered soft with milk and honey. Humble, warming, and older than every trend in the bowl.',
    prophetic: {
      note: 'Aisha, may Allah be pleased with her, would order talbina for the grieving and the sick, and related that the Prophet ﷺ called it a soother for the sick heart that carries away some of the sorrow.',
      citation: 'Sahih al-Bukhari 5689, narrated by Aisha',
    },
    recipeSlugs: [],
  },
  {
    slug: 'dates',
    name: 'Dates',
    kind: 'fruits & sweetness',
    note: 'The pantry’s built-in dessert. A few with coffee after dinner, and nothing else is needed.',
    prophetic: {
      note: 'Seven ajwa dates in the morning were his ﷺ counsel, and a house without dates he described as one whose people go hungry.',
      citation: 'Sahih al-Bukhari 5445, narrated by Sa’d ibn Abi Waqqas',
    },
    recipeSlugs: [],
  },
  {
    slug: 'honey',
    name: 'Honey',
    kind: 'fruits & sweetness',
    note: 'Kept near the stove, not the tea tray. A spoonful rounds out a dressing, glazes a carrot, and rescues a sauce that turned too sharp.',
    prophetic: {
      note: 'The Quran describes what comes from the bee as a drink of varying colours in which there is healing for people.',
      citation: 'Quran, Surah an-Nahl 16:69',
    },
    recipeSlugs: [],
  },
  {
    slug: 'eggs',
    name: 'Eggs',
    kind: 'dairy & eggs',
    note: 'Breakfast, binder, emergency dinner. The most forgiving ingredient I know, and the fastest route to a hot meal.',
    recipeSlugs: ['turkish-eggs'],
  },
  {
    slug: 'yoghurt',
    name: 'Yoghurt',
    kind: 'dairy & eggs',
    note: 'Cooling, sharp, endlessly useful. The base of a marinade, the calm under spiced butter, the sauce that fixes the plate.',
    recipeSlugs: ['turkish-eggs'],
  },
  {
    slug: 'butter',
    name: 'Butter',
    kind: 'dairy & eggs',
    note: 'Browned until it smells like toasted nuts, it becomes a sauce in its own right. I brown more than any recipe asks for.',
    recipeSlugs: ['turkish-eggs'],
  },
  {
    slug: 'garlic',
    name: 'Garlic',
    kind: 'aromatics & preserved',
    note: 'Where almost everything in my kitchen begins. Taken slow in warm oil it turns sweet and patient, and nothing replaces it.',
    recipeSlugs: ['spaghetti-aglio-e-olio', 'chinese-prawn-spaghetti', 'turkish-eggs'],
  },
  {
    slug: 'olive-oil',
    name: 'Olive oil',
    kind: 'aromatics & preserved',
    note: 'The workhorse and the finishing touch in one bottle. I keep one for the pan and one worth tasting on its own.',
    prophetic: {
      note: 'The Quran calls the olive a blessed tree, and the Prophet ﷺ said to eat its oil and to anoint yourselves with it.',
      citation: 'Jami’ at-Tirmidhi 1851; Quran, Surah an-Nur 24:35',
    },
    recipeSlugs: ['spaghetti-aglio-e-olio'],
  },
  {
    slug: 'lamb',
    name: 'Lamb',
    kind: 'meat & fish',
    note: 'The meat I reach for when a dish should taste like somewhere. It carries cumin and chile like nothing else on the shelf.',
    recipeSlugs: ['xinjiang-lamb-dumplings'],
  },
];

/* ── Placeholder flat-ink art ────────────────────────────────────────────
   Hand-sketched stroke SVGs standing in for the real rendered assets.
   Two-tone per the stamp grammar: brown ink line work, one terracotta
   accent. Real art arrives via the established Sora prompt + ingest
   pipeline once the card treatment is picked. */

const INK = 'var(--stamp-ink-brown)';
const ACCENT = 'var(--stamp-ink-terracotta)';

function Art({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ART: Record<string, ReactNode> = {
  barley: (
    <Art>
      <path d="M50 88 V30" stroke={INK} strokeWidth={3} />
      {[38, 50, 62].map(y => (
        <g key={y}>
          <path d={`M50 ${y} q -14 2 -16 14 q 12 0 16 -8`} stroke={INK} strokeWidth={2.5} />
          <path d={`M50 ${y} q 14 2 16 14 q -12 0 -16 -8`} stroke={INK} strokeWidth={2.5} />
        </g>
      ))}
      <path d="M50 30 L38 12 M50 30 L50 8 M50 30 L62 12" stroke={ACCENT} strokeWidth={2.5} />
    </Art>
  ),
  dates: (
    <Art>
      <path d="M50 10 q 2 14 0 22" stroke={INK} strokeWidth={3} />
      <path d="M50 16 q 18 -6 30 4 M50 16 q -18 -6 -30 4" stroke={INK} strokeWidth={2.5} />
      <ellipse cx="36" cy="52" rx="9" ry="15" stroke={INK} strokeWidth={3} />
      <ellipse cx="58" cy="58" rx="9" ry="15" stroke={INK} strokeWidth={3} transform="rotate(12 58 58)" />
      <ellipse cx="46" cy="74" rx="8.5" ry="14" stroke={ACCENT} strokeWidth={3} transform="rotate(-8 46 74)" />
      <path d="M50 32 q -12 4 -14 8 M50 32 q 8 8 8 12 M50 32 q 0 22 -4 28" stroke={INK} strokeWidth={2} />
    </Art>
  ),
  honey: (
    <Art>
      <path d="M62 18 L34 74" stroke={INK} strokeWidth={3} />
      {[
        [40, 62, 15],
        [45, 52, 18],
        [50, 42, 15],
      ].map(([cx, cy, rx]) => (
        <ellipse key={cy} cx={cx} cy={cy} rx={rx} ry={6.5} stroke={INK} strokeWidth={3} />
      ))}
      <circle cx="65" cy="14" r="4.5" stroke={INK} strokeWidth={3} />
      <path d="M38 84 q 4 8 8 0 q 0 -6 -4 -10 q -4 4 -4 10 Z" stroke={ACCENT} strokeWidth={2.5} />
    </Art>
  ),
  eggs: (
    <Art>
      <path d="M40 86 c -14 0 -22 -10 -22 -24 c 0 -18 10 -40 22 -40 c 12 0 22 22 22 40 c 0 14 -8 24 -22 24 Z" stroke={INK} strokeWidth={3} />
      <path d="M66 78 c 10 -2 16 -10 15 -21 c -1 -14 -10 -30 -20 -29 c -5 0.5 -9 5 -11 11" stroke={INK} strokeWidth={3} />
      {[[34, 46], [44, 58], [37, 66]].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={1.6} fill={ACCENT} stroke="none" />
      ))}
    </Art>
  ),
  yoghurt: (
    <Art>
      <path d="M18 48 h 64 q -2 22 -18 30 h -28 q -16 -8 -18 -30 Z" stroke={INK} strokeWidth={3} />
      <path d="M28 48 q 10 -10 22 -4 q 12 6 22 -2" stroke={ACCENT} strokeWidth={2.5} />
      <path d="M62 44 L78 16" stroke={INK} strokeWidth={3} />
      <ellipse cx="80" cy="13" rx="6" ry="4.5" stroke={INK} strokeWidth={2.5} transform="rotate(-30 80 13)" />
    </Art>
  ),
  butter: (
    <Art>
      <path d="M18 58 L42 46 L84 46 L60 58 Z M18 58 L60 58 L60 78 L18 78 Z M60 78 L84 66 L84 46" stroke={INK} strokeWidth={3} />
      <path d="M30 40 L48 31 L66 31 L48 40 Z M30 40 L48 40 L48 46" stroke={ACCENT} strokeWidth={2.5} />
    </Art>
  ),
  garlic: (
    <Art>
      <path d="M50 30 c -4 -8 -2 -14 2 -18" stroke={ACCENT} strokeWidth={3} />
      <path d="M50 30 c -18 2 -28 14 -28 30 c 0 16 12 26 28 26 c 16 0 28 -10 28 -26 c 0 -16 -10 -28 -28 -30 Z" stroke={INK} strokeWidth={3} />
      <path d="M50 30 c -6 16 -6 40 -2 55 M50 30 c 8 14 10 36 8 54 M38 34 c -8 14 -9 32 -6 44 M62 35 c 8 12 9 30 6 42" stroke={INK} strokeWidth={2} />
      <path d="M42 87 q 2 5 4 6 M52 88 q 0 5 2 6" stroke={INK} strokeWidth={1.8} />
    </Art>
  ),
  'olive-oil': (
    <Art>
      <path d="M42 12 h 12 v 12 q 12 8 12 24 v 34 q 0 6 -6 6 h -24 q -6 0 -6 -6 V 48 q 0 -16 12 -24 Z" stroke={INK} strokeWidth={3} />
      <path d="M40 12 h 16" stroke={INK} strokeWidth={3} />
      <path d="M36 56 q 12 -8 26 0" stroke={INK} strokeWidth={2} />
      <path d="M44 66 q 6 -8 14 -4" stroke={INK} strokeWidth={2} />
      <ellipse cx="42" cy="74" rx="4" ry="5.5" stroke={ACCENT} strokeWidth={2.5} />
      <ellipse cx="56" cy="76" rx="4" ry="5.5" stroke={ACCENT} strokeWidth={2.5} />
    </Art>
  ),
  lamb: (
    // A frenched lamb chop: exposed rib bone, rounded eye of meat, fat cap.
    <Art>
      <path d="M62 14 L48 44" stroke={INK} strokeWidth={3.5} />
      <path d="M70 12 L56 40" stroke={INK} strokeWidth={3.5} />
      <path d="M62 14 q 4 -6 10 -2 M62 14 L70 12" stroke={INK} strokeWidth={3} />
      <path d="M52 42 c -18 -4 -32 8 -32 24 c 0 14 12 22 26 22 c 16 0 26 -10 26 -24 c 0 -12 -8 -19 -20 -22 Z" stroke={INK} strokeWidth={3} />
      <path d="M52 42 q 16 2 20 14" stroke={ACCENT} strokeWidth={2.5} />
      <path d="M36 62 q 6 12 18 14" stroke={INK} strokeWidth={1.8} />
    </Art>
  ),
};

export function pantryArt(slug: string): ReactNode {
  return ART[slug] ?? null;
}

/* ── Seal marks — wordless at shelf distance (spec §7) ─────────────────
   Three candidates. All flat ink, no lettering, sized for a card corner. */

export type SealVariant = 'rosette' | 'octagon' | 'scallop' | 'khatam' | 'beaded' | 'shamsa' | 'girih';

const SEAL_INK = 'var(--stamp-ink-brown)';

export function PropheticSeal({ variant, size = 22 }: { variant: SealVariant; size?: number }) {
  if (variant === 'rosette') {
    // Eight-petal rosette inside a thin ring.
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" style={{ opacity: 0.62 }}>
        <circle cx="16" cy="16" r="14" stroke={SEAL_INK} strokeWidth={1.4} />
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="16" cy="8.5" rx="2.6" ry="5"
            stroke={SEAL_INK} strokeWidth={1.1}
            transform={`rotate(${i * 45} 16 16)`}
          />
        ))}
        <circle cx="16" cy="16" r="1.4" fill={SEAL_INK} stroke="none" />
      </svg>
    );
  }
  if (variant === 'octagon') {
    // Notary-style octagon with radial ticks.
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" style={{ opacity: 0.62 }}>
        <polygon
          points="11,3 21,3 29,11 29,21 21,29 11,29 3,21 3,11"
          stroke={SEAL_INK} strokeWidth={1.4}
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i} x1="16" y1="6.5" x2="16" y2="9.5"
            stroke={SEAL_INK} strokeWidth={1.1}
            transform={`rotate(${i * 45} 16 16)`}
          />
        ))}
        <circle cx="16" cy="16" r="2" stroke={SEAL_INK} strokeWidth={1.2} />
      </svg>
    );
  }
  if (variant === 'khatam') {
    // Eight-point star of two rotated squares, a core Islamic geometric motif.
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" style={{ opacity: 0.62 }}>
        <circle cx="16" cy="16" r="14" stroke={SEAL_INK} strokeWidth={1.3} />
        <rect x="8.5" y="8.5" width="15" height="15" stroke={SEAL_INK} strokeWidth={1.2} />
        <rect x="8.5" y="8.5" width="15" height="15" stroke={SEAL_INK} strokeWidth={1.2} transform="rotate(45 16 16)" />
        <circle cx="16" cy="16" r="1.4" fill={SEAL_INK} stroke="none" />
      </svg>
    );
  }
  if (variant === 'shamsa') {
    // Shamsa — the sun medallion that opens illuminated Quran manuscripts:
    // twelve lanceolate petals, radiating dots, a quiet inner ring. The most
    // book-arts of the candidates.
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" style={{ opacity: 0.62 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={`pt${i}`} cx="16" cy="6.2" rx="1.5" ry="4.4"
            stroke={SEAL_INK} strokeWidth={1}
            transform={`rotate(${i * 30} 16 16)`}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={`dt${i}`} cx="16" cy="2.2" r="0.8"
            fill={SEAL_INK} stroke="none"
            transform={`rotate(${15 + i * 30} 16 16)`}
          />
        ))}
        <circle cx="16" cy="16" r="5.6" stroke={SEAL_INK} strokeWidth={1.1} />
        <circle cx="16" cy="16" r="1.3" fill={SEAL_INK} stroke="none" />
      </svg>
    );
  }
  if (variant === 'girih') {
    // Girih / zellij twelve-point star: two hexagons rotated 30 degrees,
    // the workhorse star of Islamic geometric tiling.
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" style={{ opacity: 0.62 }}>
        <polygon
          points="29,16 22.5,27.3 9.5,27.3 3,16 9.5,4.7 22.5,4.7"
          stroke={SEAL_INK} strokeWidth={1.2}
        />
        <polygon
          points="29,16 22.5,27.3 9.5,27.3 3,16 9.5,4.7 22.5,4.7"
          stroke={SEAL_INK} strokeWidth={1.2}
          transform="rotate(30 16 16)"
        />
        <circle cx="16" cy="16" r="1.4" fill={SEAL_INK} stroke="none" />
      </svg>
    );
  }
  if (variant === 'beaded') {
    // Beaded ring around a petal core — coin-edge quiet.
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" style={{ opacity: 0.62 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <circle
            key={i} cx="16" cy="3.4" r="1.1"
            fill={SEAL_INK} stroke="none"
            transform={`rotate(${i * 22.5} 16 16)`}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse
            key={`p${i}`} cx="16" cy="10.5" rx="2.2" ry="4.2"
            stroke={SEAL_INK} strokeWidth={1.1}
            transform={`rotate(${i * 60} 16 16)`}
          />
        ))}
      </svg>
    );
  }
  // Scalloped emboss circle, like a blind notary stamp.
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" style={{ opacity: 0.62 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <circle
          key={i} cx="16" cy="3.8" r="2.6"
          stroke={SEAL_INK} strokeWidth={1.1}
          transform={`rotate(${i * 30} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="8.4" stroke={SEAL_INK} strokeWidth={1.3} />
      <circle cx="16" cy="16" r="1.5" fill={SEAL_INK} stroke="none" />
    </svg>
  );
}
