/**
 * Maps country names (lowercase) to filenames in /public/stamps/.
 * Countries not listed here fall back to the generated SVG designs.
 */
export const CUSTOM_STAMPS: Record<string, string> = {
  spain: 'spain',
  china: 'china',
  japan: 'japan',
  turkey: 'turkey',
  morocco: 'morocco',
  thailand: 'thailand',
  india: 'india',
  greece: 'greece',
  mexico: 'mexico',
  italy: 'italy',
  portugal: 'portugal',
  belgium: 'belgium',
  hungary: 'hungary',
  vietnam: 'vietnam',
  indonesia: 'indonesia',
  egypt: 'egypt',
  slovakia: 'slovakia',
  'united states': 'united-states',
  taiwan: 'taiwan',
  'hong kong': 'hong-kong',
  'south korea': 'south-korea',
  france: 'france',
  lebanon: 'lebanon',
  poland: 'poland',
  iran: 'iran',
  'sri lanka': 'sri-lanka',
  ethiopia: 'ethiopia',
  'south africa': 'south-africa',
  jamaica: 'jamaica',
  peru: 'peru',
  croatia: 'croatia',
};

export function getCustomStampSrc(country: string): string | null {
  const key = country.toLowerCase();
  const file = CUSTOM_STAMPS[key];
  return file ? `/stamps/${file}.webp` : null;
}
