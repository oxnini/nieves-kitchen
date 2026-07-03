// Curated Table spreads for the homepage hero. Hand-edited by the cook:
// append a new spread whenever tonight's table changes; the home shows the
// last entry. A spread may be a single centerpiece (sides: []) — that is a
// legitimate table, not a degraded state (spec §5).
export interface TableSpread {
  /** Editorial line above the dish, e.g. "Tonight's table". */
  title: string;
  /** Margin note in the cook's voice. Optional. */
  note?: string;
  /** Recipe slug of the centerpiece. */
  main: string;
  /** Recipe slugs of the sides, in serving order. Empty until sides exist. */
  sides: string[];
}

export const TABLE_SPREADS: TableSpread[] = [
  {
    title: 'Tonight’s table',
    note: 'A centerpiece worth building an evening around.',
    main: 'classic-lasagna',
    sides: [],
  },
];

export function currentSpread(): TableSpread {
  return TABLE_SPREADS[TABLE_SPREADS.length - 1];
}
