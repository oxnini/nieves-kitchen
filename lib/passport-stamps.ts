/**
 * Custom stamp assets in /public/stamps/.
 *
 * Each entry maps a lowercase country name to its filename (without extension)
 * and the natural aspect ratio (width / height) of the source WebP. The
 * aspect ratio is consumed by `CountryStampSlot` to size every image stamp
 * for roughly equal visual area regardless of portrait/landscape shape — so a
 * tall stamp like China reads at the same visual mass as a square one like
 * Japan instead of being arbitrarily small or oversized.
 *
 * Countries not listed here fall back to the procedurally-generated SVG
 * designs.
 */

export interface CustomStampMeta {
  /** Filename in /public/stamps/ without the .webp extension. */
  file: string;
  /** Source image aspect ratio (width / height). */
  aspect: number;
}

export const CUSTOM_STAMPS: Record<string, CustomStampMeta> = {
  spain: { file: 'spain', aspect: 358 / 314 },
  china: { file: 'china', aspect: 354 / 600 },
  japan: { file: 'japan', aspect: 590 / 600 },
  turkey: { file: 'turkey', aspect: 1254 / 1254 },
  morocco: { file: 'morocco', aspect: 311 / 313 },
  thailand: { file: 'thailand', aspect: 1254 / 1254 },
  india: { file: 'india', aspect: 1254 / 1254 },
  greece: { file: 'greece', aspect: 365 / 322 },
  mexico: { file: 'mexico', aspect: 350 / 312 },
  italy: { file: 'italy', aspect: 383 / 411 },
  portugal: { file: 'portugal', aspect: 400 / 284 },
  belgium: { file: 'belgium', aspect: 326 / 317 },
  hungary: { file: 'hungary', aspect: 426 / 291 },
  vietnam: { file: 'vietnam', aspect: 1254 / 1254 },
  indonesia: { file: 'indonesia', aspect: 1254 / 1254 },
  philippines: { file: 'philippines', aspect: 1254 / 1254 },
  egypt: { file: 'egypt', aspect: 425 / 267 },
  slovakia: { file: 'slovakia', aspect: 419 / 273 },
  'united states': { file: 'united-states', aspect: 464 / 287 },
  taiwan: { file: 'taiwan', aspect: 535 / 600 },
  'hong kong': { file: 'hong-kong', aspect: 600 / 400 },
  'south korea': { file: 'south-korea', aspect: 600 / 596 },
  france: { file: 'france', aspect: 410 / 402 },
  lebanon: { file: 'lebanon', aspect: 1254 / 1254 },
  poland: { file: 'poland', aspect: 436 / 320 },
  iran: { file: 'iran', aspect: 430 / 321 },
  'sri lanka': { file: 'sri-lanka', aspect: 1254 / 1254 },
  ethiopia: { file: 'ethiopia', aspect: 421 / 298 },
  'south africa': { file: 'south-africa', aspect: 461 / 312 },
  jamaica: { file: 'jamaica', aspect: 322 / 324 },
  peru: { file: 'peru', aspect: 413 / 307 },
  croatia: { file: 'croatia', aspect: 453 / 305 },
  pakistan: { file: 'pakistan', aspect: 1254 / 1254 },
  bangladesh: { file: 'bangladesh', aspect: 1254 / 1254 },
  malaysia: { file: 'malaysia', aspect: 1254 / 1254 },
  singapore: { file: 'singapore', aspect: 1254 / 1254 },
};

export function getCustomStampMeta(country: string): CustomStampMeta | null {
  return CUSTOM_STAMPS[country.toLowerCase()] ?? null;
}

export function getCustomStampSrc(country: string): string | null {
  const meta = getCustomStampMeta(country);
  return meta ? `/stamps/${meta.file}.webp` : null;
}
