import type { UnitSystem } from '@/hooks/useUnitPref';

type Family = 'volume' | 'mass';

interface UnitDef {
  family: Family;
  system: UnitSystem;
  toBase: number;
}

const UNITS: Record<string, UnitDef> = {
  cup:         { family: 'volume', system: 'us', toBase: 240 },
  cups:        { family: 'volume', system: 'us', toBase: 240 },
  tbsp:        { family: 'volume', system: 'us', toBase: 15 },
  tbsps:       { family: 'volume', system: 'us', toBase: 15 },
  tablespoon:  { family: 'volume', system: 'us', toBase: 15 },
  tablespoons: { family: 'volume', system: 'us', toBase: 15 },
  tsp:         { family: 'volume', system: 'us', toBase: 5 },
  tsps:        { family: 'volume', system: 'us', toBase: 5 },
  teaspoon:    { family: 'volume', system: 'us', toBase: 5 },
  teaspoons:   { family: 'volume', system: 'us', toBase: 5 },
  'fl oz':     { family: 'volume', system: 'us', toBase: 30 },
  pint:        { family: 'volume', system: 'us', toBase: 473 },
  pints:       { family: 'volume', system: 'us', toBase: 473 },
  quart:       { family: 'volume', system: 'us', toBase: 946 },
  quarts:      { family: 'volume', system: 'us', toBase: 946 },
  gallon:      { family: 'volume', system: 'us', toBase: 3785 },
  gallons:     { family: 'volume', system: 'us', toBase: 3785 },

  ml:     { family: 'volume', system: 'metric', toBase: 1 },
  l:      { family: 'volume', system: 'metric', toBase: 1000 },
  liter:  { family: 'volume', system: 'metric', toBase: 1000 },
  liters: { family: 'volume', system: 'metric', toBase: 1000 },

  oz:     { family: 'mass', system: 'us', toBase: 28.35 },
  ounce:  { family: 'mass', system: 'us', toBase: 28.35 },
  ounces: { family: 'mass', system: 'us', toBase: 28.35 },
  lb:     { family: 'mass', system: 'us', toBase: 453.6 },
  lbs:    { family: 'mass', system: 'us', toBase: 453.6 },
  pound:  { family: 'mass', system: 'us', toBase: 453.6 },
  pounds: { family: 'mass', system: 'us', toBase: 453.6 },

  g:     { family: 'mass', system: 'metric', toBase: 1 },
  gram:  { family: 'mass', system: 'metric', toBase: 1 },
  grams: { family: 'mass', system: 'metric', toBase: 1 },
  kg:    { family: 'mass', system: 'metric', toBase: 1000 },
};

function round(n: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

// Spoons are kitchen measures in every system: a metric kitchen still has a
// teaspoon, and "2 tsp" in the list must match "2 tsp" in the method.
const SPOONS = new Set(['tbsp', 'tbsps', 'tablespoon', 'tablespoons', 'tsp', 'tsps', 'teaspoon', 'teaspoons']);

// Weighed and poured metric amounts read as decimals ("1.5 kg"); everything
// else (spoons, cups, ounces, "½ onion") reads as a kitchen fraction.
const DECIMAL_UNITS = new Set(['g', 'gram', 'grams', 'kg', 'ml', 'l', 'liter', 'liters']);

const FRACTIONS: [number, string][] = [
  [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'], [1 / 2, '½'],
  [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'],
];

function asFraction(n: number): string | null {
  const whole = Math.floor(n);
  const rest = n - whole;
  if (rest < 0.03) return String(whole);
  if (rest > 0.97) return String(whole + 1);
  for (const [value, glyph] of FRACTIONS) {
    if (Math.abs(rest - value) < 0.03) return whole ? `${whole}${glyph}` : glyph;
  }
  return null;
}

export function formatAmount(n: number, unit = ''): string {
  if (n >= 100) return String(Math.round(n));
  if (!DECIMAL_UNITS.has(unit.toLowerCase().trim())) {
    const fraction = asFraction(n);
    if (fraction) return fraction;
  }
  if (Math.abs(n - Math.round(n)) < 0.05) return String(Math.round(n));
  const fixed = n.toFixed(n >= 10 ? 1 : 2);
  return fixed.replace(/\.?0+$/, '');
}

export function convertUnit(
  amount: number,
  unit: string,
  target: UnitSystem,
): { amount: number; unit: string } {
  const key = unit.toLowerCase().trim();
  const def = UNITS[key];
  if (!def || def.system === target || SPOONS.has(key)) return { amount, unit };

  const base = amount * def.toBase;

  if (target === 'metric') {
    if (def.family === 'volume') {
      return base >= 1000
        ? { amount: round(base / 1000, 2), unit: 'l' }
        : { amount: round(base, 0), unit: 'ml' };
    }
    return base >= 1000
      ? { amount: round(base / 1000, 2), unit: 'kg' }
      : { amount: round(base, 0), unit: 'g' };
  }

  if (def.family === 'volume') {
    if (base >= 240) return { amount: round(base / 240, 2), unit: 'cup' };
    if (base >= 15) return { amount: round(base / 15, 1), unit: 'tbsp' };
    return { amount: round(base / 5, 1), unit: 'tsp' };
  }
  return base >= 453.6
    ? { amount: round(base / 453.6, 2), unit: 'lb' }
    : { amount: round(base / 28.35, 1), unit: 'oz' };
}
