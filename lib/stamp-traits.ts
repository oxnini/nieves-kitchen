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
export type StampInnerDetail = 'none' | 'double-ring' | 'corner-ticks' | 'inner-frame';

export interface StampTraits {
  shape: StampShape;
  sizeBucket: StampSizeBucket;
  borderStyle: StampBorderStyle;
  borderWeight: StampBorderWeight;
  innerDetail: StampInnerDetail;
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
const INNER_DETAILS: StampInnerDetail[] = ['none', 'double-ring', 'corner-ticks', 'inner-frame'];

/**
 * Deterministic stamp traits for a country.
 * Uses successive slices of the hash to pick each trait independently.
 */
export function getStampTraits(country: string): StampTraits {
  const h = hashCountry(country);
  return {
    shape: SHAPES[h % SHAPES.length],
    sizeBucket: SIZE_BUCKETS[Math.floor(h / SHAPES.length) % SIZE_BUCKETS.length],
    borderStyle: BORDER_STYLES[Math.floor(h / (SHAPES.length * SIZE_BUCKETS.length)) % BORDER_STYLES.length],
    borderWeight: BORDER_WEIGHTS[Math.floor(h / (SHAPES.length * SIZE_BUCKETS.length * BORDER_STYLES.length)) % BORDER_WEIGHTS.length],
    innerDetail: INNER_DETAILS[Math.floor(h / (SHAPES.length * SIZE_BUCKETS.length * BORDER_STYLES.length * BORDER_WEIGHTS.length)) % INNER_DETAILS.length],
  };
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
    case 'hexagon':        return [1, 1];
    case 'triangle':       return [1.1, 1];
    case 'diamond':        return [1, 1.15];
    case 'pill':           return [1.5, 0.85];
  }
}

/** Rotation angle in degrees, deterministic per country. Same logic as the old angleForCountry. */
export function stampAngle(country: string): number {
  const h = hashCountry(country);
  return ((h % 61) - 30) / 10;
}
