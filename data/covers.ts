// Hand-curated home covers. Append a new entry to publish a cover; the home
// shows the last one. Replaces data/table-spreads.ts (retired after the
// 2026-07-10 cover redesign ships). Copy rules: no em dashes, halal-confident
// voice, never fabricate citations.
export interface Cover {
  /** ISO date this cover went up; dateline month derives from it. */
  publishedOn: string;
  /** Recipe slug of the cover dish. */
  recipe: string;
  /** Back-page pull, e.g. "The Levant, by way of a mezze table?" */
  whereNext: { line: string };
}

export const COVERS: Cover[] = [
  {
    publishedOn: '2026-07-10',
    recipe: 'chinese-prawn-spaghetti',
    whereNext: { line: 'The Levant, by way of a mezze table?' },
  },
];

export function currentCover(): Cover {
  return COVERS[COVERS.length - 1];
}

/** "July 2026" for the active cover, parsed from publishedOn without TZ drift. */
export function coverMonthYear(cover: Cover = currentCover()): string {
  const [year, month] = cover.publishedOn.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
