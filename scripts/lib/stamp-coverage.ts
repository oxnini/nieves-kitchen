// scripts/lib/stamp-coverage.ts
//
// Resolves a recipe's country to its passport-stamp readiness, combining the
// CUSTOM_STAMPS registry (is there an asset?) with docs/stamps/CHECKLIST.md
// (is it the approved [x] version?). Stamps are keyed by country, so every
// recipe from a country shares its stamp status.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CUSTOM_STAMPS } from '../../lib/passport-stamps';

export type StampStatus = 'approved' | 'needs-replacing' | 'missing';

const CHECKLIST_PATH = resolve(process.cwd(), 'docs/stamps/CHECKLIST.md');

/** Parse "- [x] Country  <!-- note -->" lines into lowercase-name -> mark. */
function loadChecklist(): Map<string, string> {
  const map = new Map<string, string>();
  let text = '';
  try {
    text = readFileSync(CHECKLIST_PATH, 'utf8');
    text = text.replace(/<!--[\s\S]*?-->/g, '');
  } catch {
    return map; // no checklist => fall back to CUSTOM_STAMPS only
  }
  const re = /^- \[([ x~])\]\s+(.+?)\s*(?:<!--.*-->)?\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    map.set(m[2].trim().toLowerCase(), m[1]);
  }
  return map;
}

const checklist = loadChecklist();

export function stampStatusForCountry(country: string): StampStatus {
  const key = country.trim().toLowerCase();
  const hasAsset = key in CUSTOM_STAMPS;
  const mark = checklist.get(key);
  if (hasAsset && mark === 'x') return 'approved';
  if (hasAsset) return 'needs-replacing'; // asset present but [~]/[ ]/unlisted
  return 'missing'; // no custom asset; only the procedural fallback renders
}
