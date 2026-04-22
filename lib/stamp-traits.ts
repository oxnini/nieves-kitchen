export type StampShape =
  | 'circle'
  | 'rect-landscape'
  | 'rect-portrait'
  | 'oval-landscape'
  | 'oval-portrait'
  | 'hexagon'
  | 'triangle'
  | 'diamond'
  | 'pill';

export type StampSizeBucket = 'sm' | 'md' | 'lg';
export type StampBorderStyle = 'solid' | 'dashed' | 'dotted';
export type StampBorderWeight = 'thin' | 'medium';
export type StampInnerDetail = 'none' | 'double-ring' | 'inner-frame';

/** Dark ink colors that read well on parchment and feel like real passport stamps. */
export type StampColor =
  | 'ink-brown'      // warm dark brown — the default paprika-adjacent
  | 'ink-navy'       // deep navy blue
  | 'ink-forest'     // dark forest green
  | 'ink-charcoal'   // near-black charcoal
  | 'ink-wine'       // dark burgundy/wine
  | 'ink-slate'      // cool dark grey
  | 'ink-terracotta'; // muted terracotta

export interface StampTraits {
  shape: StampShape;
  sizeBucket: StampSizeBucket;
  borderStyle: StampBorderStyle;
  borderWeight: StampBorderWeight;
  innerDetail: StampInnerDetail;
  color: StampColor;
}

/** Stable 32-bit hash from a country name string. */
function hashCountry(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const SHAPES: StampShape[] = [
  'circle', 'rect-landscape', 'rect-portrait',
  'oval-landscape', 'oval-portrait', 'hexagon',
  'triangle', 'diamond', 'pill',
];

const SIZE_BUCKETS: StampSizeBucket[] = ['sm', 'md', 'lg'];
const BORDER_STYLES: StampBorderStyle[] = ['solid', 'dashed', 'dotted'];
const BORDER_WEIGHTS: StampBorderWeight[] = ['thin', 'medium'];
const INNER_DETAILS: StampInnerDetail[] = ['none', 'double-ring', 'inner-frame'];

const COLORS: StampColor[] = [
  'ink-brown', 'ink-navy', 'ink-forest', 'ink-charcoal',
  'ink-wine', 'ink-slate', 'ink-terracotta',
];

/**
 * Deterministic stamp traits for a country.
 * Uses successive slices of the hash to pick each trait independently.
 */
export function getStampTraits(country: string): StampTraits {
  const h = hashCountry(country);

  const shape = SHAPES[h % SHAPES.length];
  const d1 = SHAPES.length;
  const sizeBucket = SIZE_BUCKETS[Math.floor(h / d1) % SIZE_BUCKETS.length];
  const d2 = d1 * SIZE_BUCKETS.length;
  const borderStyle = BORDER_STYLES[Math.floor(h / d2) % BORDER_STYLES.length];
  const d3 = d2 * BORDER_STYLES.length;
  const borderWeight = BORDER_WEIGHTS[Math.floor(h / d3) % BORDER_WEIGHTS.length];
  const d4 = d3 * BORDER_WEIGHTS.length;
  const innerDetail = INNER_DETAILS[Math.floor(h / d4) % INNER_DETAILS.length];
  const d5 = d4 * INNER_DETAILS.length;
  const color = COLORS[Math.floor(h / d5) % COLORS.length];

  return { shape, sizeBucket, borderStyle, borderWeight, innerDetail, color };
}

/** Size multiplier relative to base --stamp-size. Range is intentionally subtle. */
export function sizeMultiplier(bucket: StampSizeBucket): number {
  switch (bucket) {
    case 'sm': return 0.85;
    case 'md': return 1.0;
    case 'lg': return 1.15;
  }
}

/** Aspect ratio [width, height] relative to the stamp's computed size. */
export function shapeAspect(shape: StampShape): [number, number] {
  switch (shape) {
    case 'circle':         return [1, 1];
    case 'rect-landscape': return [1.3, 1];
    case 'rect-portrait':  return [1, 1.3];
    case 'oval-landscape': return [1.3, 1];
    case 'oval-portrait':  return [1, 1.3];
    case 'hexagon':        return [1.15, 1.15];
    case 'triangle':       return [1.35, 1.25];
    case 'diamond':        return [1.15, 1.3];
    case 'pill':           return [1.5, 0.85];
  }
}

/** Rotation angle in degrees, deterministic per country. Same logic as the old angleForCountry. */
export function stampAngle(country: string): number {
  const h = hashCountry(country);
  return ((h % 61) - 30) / 10;
}

/** CSS color value for a stamp ink color. */
export function stampColorValue(color: StampColor): string {
  switch (color) {
    case 'ink-brown':      return 'oklch(0.40 0.05 50)';
    case 'ink-navy':       return 'oklch(0.38 0.07 260)';
    case 'ink-forest':     return 'oklch(0.40 0.06 155)';
    case 'ink-charcoal':   return 'oklch(0.32 0.01 60)';
    case 'ink-wine':       return 'oklch(0.38 0.08 15)';
    case 'ink-slate':      return 'oklch(0.45 0.02 260)';
    case 'ink-terracotta': return 'oklch(0.45 0.09 35)';
  }
}
