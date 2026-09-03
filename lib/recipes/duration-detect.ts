/**
 * Conservative cook-mode duration detector.
 *
 * Returns matched source-string ranges plus the lower-bound in milliseconds
 * for each candidate duration. Cook mode renders these as tappable tokens
 * (subtle dotted underline) that seed the page timer on tap.
 *
 * Gate: a match only counts if the word immediately preceding it (after
 * trimming whitespace) is in the allow list. No sentence-start exception —
 * "5m of bread" with no preceding verb is rejected even at index 0. Better
 * to under-detect than to spam tokens in prose that doesn't mean a duration.
 *
 * Allow list:  for, cook, bake, simmer, roast, boil, fry, steam, rest,
 *              marinate, chill, proof, until, about, approximately, roughly
 *              (each in its bare and -ed/-ing forms where natural).
 * Reject list: before, after, every, each, in, within (positional/frequency).
 * Phrase reject: "over the next " immediately before the candidate.
 *
 * Manual fixtures verified by hand:
 *   "Simmer for 25 minutes"        → match, lower 1_500_000 ms
 *   "Cook for 20-30 mins"          → match, lower 1_200_000 ms
 *   "Rest 1 hour"                  → match, lower 3_600_000 ms
 *   "Every 5 minutes stir"         → reject
 *   "Within 10 minutes of removing"→ reject
 *   "About 2 hours"                → match, 7_200_000 ms
 *   "5m of bread"                  → reject (no allow-listed verb)
 *   "Bake for 12 minutes"          → match
 *   "until 1 hour passes"          → match
 *   "in 5 minutes"                 → reject
 *   "after 10 minutes"             → reject
 *   "Marinate for 20–30 minutes"   → match (en-dash range)
 *   "Simmer for 5 to 10 minutes"   → match, lower 300_000 ms ("to" range)
 *   "Fry for 30 to 60 seconds"     → match, lower 30_000 ms
 *   "for 1 or 2 minutes"           → match, lower 60_000 ms ("or" range)
 *   "1 or 2 tablespoons"           → reject (no unit; not a range)
 */

export interface DurationMatch {
  start: number;
  end: number;
  lowerBoundMs: number;
}

const ALLOW = new Set<string>([
  'for',
  'cook', 'cooked', 'cooking',
  'bake', 'baked', 'baking',
  'simmer', 'simmered', 'simmering',
  'roast', 'roasted', 'roasting',
  'boil', 'boiled', 'boiling',
  'fry', 'fried', 'frying',
  'steam', 'steamed', 'steaming',
  'rest', 'rested', 'resting',
  'marinate', 'marinated', 'marinating',
  'chill', 'chilled', 'chilling',
  'proof', 'proofed', 'proofing',
  'until', 'about', 'approximately', 'roughly',
]);

const REJECT = new Set<string>([
  'before', 'after', 'every', 'each', 'in', 'within',
]);

const UNIT_MS: Record<string, number> = {
  s: 1_000, sec: 1_000, secs: 1_000, second: 1_000, seconds: 1_000,
  m: 60_000, min: 60_000, mins: 60_000, minute: 60_000, minutes: 60_000,
  h: 3_600_000, hr: 3_600_000, hrs: 3_600_000, hour: 3_600_000, hours: 3_600_000,
};

// Ranges are written two ways in the catalogue and both must be read, or the
// whole match is dropped: a dash ("20-30 minutes") or the word "to"/"or"
// ("5 to 10 minutes"). Word separators demand surrounding whitespace so
// "1 or 2 tablespoons" can never be mistaken for a range.
// – en-dash, — em-dash (rare in durations but covered), − minus sign.
const DURATION_PATTERN =
  /(\d+)(?:(?:\s?[–—−-]\s?|\s+(?:to|or)\s+)(\d+))?\s?(seconds?|secs?|minutes?|mins?|hours?|hrs?|s|m|h)\b/gi;

function unitMs(raw: string): number | null {
  return UNIT_MS[raw.toLowerCase()] ?? null;
}

function passesContextGate(text: string, matchStart: number): boolean {
  const windowSize = 24;
  const leftStart = Math.max(0, matchStart - windowSize);
  const left = text.slice(leftStart, matchStart);

  // Phrase reject: "over the next " right before the candidate.
  if (/over\s+the\s+next\s*$/i.test(left)) return false;

  const words = left.toLowerCase().match(/[a-z]+/g);
  if (!words || words.length === 0) return false;
  const last = words[words.length - 1];

  if (REJECT.has(last)) return false;
  if (ALLOW.has(last)) return true;
  return false;
}

export function detectDurations(text: string): DurationMatch[] {
  const out: DurationMatch[] = [];
  if (!text) return out;
  DURATION_PATTERN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = DURATION_PATTERN.exec(text)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    const lowerRaw = m[1];
    const unitRaw = m[3];
    const u = unitMs(unitRaw);
    if (u === null) continue;
    if (!passesContextGate(text, start)) continue;
    const lower = parseInt(lowerRaw, 10);
    if (!Number.isFinite(lower) || lower <= 0) continue;
    out.push({ start, end, lowerBoundMs: lower * u });
  }
  return out;
}
