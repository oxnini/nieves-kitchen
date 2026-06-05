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
  /**
   * Optional per-stamp size multiplier. Defaults to 1. Multiplies both width
   * and height, so visual area scales by `scale²`. Use sparingly — only when
   * a stamp carries fine internal detail (small lettering, dense illustration)
   * that the equal-area baseline crushes below legibility.
   */
  scale?: number;
}

export const CUSTOM_STAMPS: Record<string, CustomStampMeta> = {
  spain: { file: 'spain', aspect: 358 / 314 },
  china: { file: 'china', aspect: 354 / 600 },
  japan: { file: 'japan', aspect: 590 / 600 },
  turkey: { file: 'turkey', aspect: 1254 / 1254 },
  morocco: { file: 'morocco', aspect: 1066 / 1089 },
  thailand: { file: 'thailand', aspect: 965 / 858, scale: 1.1 },
  india: { file: 'india', aspect: 881 / 793 },
  greece: { file: 'greece', aspect: 365 / 322 },
  mexico: { file: 'mexico', aspect: 350 / 312 },
  italy: { file: 'italy', aspect: 383 / 411 },
  portugal: { file: 'portugal', aspect: 400 / 284 },
  belgium: { file: 'belgium', aspect: 326 / 317 },
  hungary: { file: 'hungary', aspect: 426 / 291 },
  vietnam: { file: 'vietnam', aspect: 545 / 424 },
  indonesia: { file: 'indonesia', aspect: 728 / 625 },
  philippines: { file: 'philippines', aspect: 732 / 626 },
  egypt: { file: 'egypt', aspect: 438 / 441 },
  algeria: { file: 'algeria', aspect: 455 / 422 },
  tunisia: { file: 'tunisia', aspect: 366 / 481 },
  libya: { file: 'libya', aspect: 400 / 435 },
  sudan: { file: 'sudan', aspect: 392 / 448 },
  slovakia: { file: 'slovakia', aspect: 419 / 273 },
  'united states': { file: 'united-states', aspect: 464 / 287 },
  taiwan: { file: 'taiwan', aspect: 535 / 600 },
  'hong kong': { file: 'hong-kong', aspect: 600 / 400 },
  'south korea': { file: 'south-korea', aspect: 600 / 596 },
  france: { file: 'france', aspect: 410 / 402 },
  lebanon: { file: 'lebanon', aspect: 1334 / 1022, scale: 1.3 },
  poland: { file: 'poland', aspect: 436 / 320 },
  iran: { file: 'iran', aspect: 766 / 1149 },
  'sri lanka': { file: 'sri-lanka', aspect: 1429 / 978, scale: 1.1 },
  ethiopia: { file: 'ethiopia', aspect: 996 / 784, scale: 1.15 },
  ghana: { file: 'ghana', aspect: 301 / 373 },
  'south africa': { file: 'south-africa', aspect: 846 / 806 },
  jamaica: { file: 'jamaica', aspect: 946 / 913 },
  peru: { file: 'peru', aspect: 413 / 307 },
  croatia: { file: 'croatia', aspect: 453 / 305 },
  pakistan: { file: 'pakistan', aspect: 1246 / 1021, scale: 1.242 },
  bangladesh: { file: 'bangladesh', aspect: 1277 / 967, scale: 1.05 },
  malaysia: { file: 'malaysia', aspect: 900 / 701 },
  singapore: { file: 'singapore', aspect: 1254 / 1254 },
  afghanistan: { file: 'afghanistan', aspect: 1254 / 1254 },
  nepal: { file: 'nepal', aspect: 1254 / 1254 },
  bhutan: { file: 'bhutan', aspect: 1254 / 1254 },
  kazakhstan: { file: 'kazakhstan', aspect: 1254 / 1254 },
  uzbekistan: { file: 'uzbekistan', aspect: 1254 / 1254 },
  turkmenistan: { file: 'turkmenistan', aspect: 1254 / 1254 },
  kenya: { file: 'kenya', aspect: 1309 / 1022 },
  'saudi arabia': { file: 'saudi-arabia', aspect: 798 / 965 },
  cyprus: { file: 'cyprus', aspect: 1161 / 1021, scale: 1.1 },
  argentina: { file: 'argentina', aspect: 1492 / 1020, scale: 1.2 },
  senegal: { file: 'senegal', aspect: 367 / 415 },
  gambia: { file: 'gambia', aspect: 350 / 387 },
  liberia: { file: 'liberia', aspect: 267 / 426 },
  nigeria: { file: 'nigeria', aspect: 367 / 389 },
  togo: { file: 'togo', aspect: 305 / 375 },
  'sierra leone': { file: 'sierra-leone', aspect: 348 / 387 },
  niger: { file: 'niger', aspect: 322 / 376 },
};

export function getCustomStampMeta(country: string): CustomStampMeta | null {
  return CUSTOM_STAMPS[country.toLowerCase()] ?? null;
}

export function getCustomStampSrc(country: string): string | null {
  const meta = getCustomStampMeta(country);
  return meta ? `/stamps/${meta.file}.webp` : null;
}
