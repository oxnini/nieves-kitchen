'use client';

import Link from 'next/link';
import type { Recipe } from '@/lib/types';
import { Eyebrow } from '@/components/courtyard';

/**
 * Read-mode back matter: Variations, Substitutions, Storage & Reheating, Tips.
 *
 * Two ruled columns at full width (audit F13): no boxes and no heading icons,
 * the headings ruled like Method's. Variations sit on the left, Substitutions
 * on the right, and Storage goes under whichever of the two is shorter. Each
 * entry is a ruled row with a run-in bold head where the copy already has
 * one. Below md the columns stack in reading order. Tips are the margin note:
 * a tinted box with an eyebrow label and numbered notes, spanning both
 * columns, last in the back matter.
 */

const body = 'font-body text-[16px] sm:text-[17px] text-brown-dark leading-[1.7]';
const heading = 'font-heading text-[25px] font-normal text-brown-dark border-b border-brown-dark pb-2.5 mb-1';

/**
 * Render `[label](/path)` in back-matter copy as an in-app link, leaving the
 * rest of the string as plain text. Deliberately internal-only: an href must
 * start with a single `/`, so recipe copy can point at another recipe (a
 * variation that reuses leftovers from one, say) but can never smuggle an
 * off-site or `javascript:` URL into the page.
 */
const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

export function withLinks(text: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      <Link
        key={at}
        href={m[2]}
        className="text-teal underline decoration-teal/35 underline-offset-[3px] transition-colors hover:decoration-teal"
      >
        {m[1]}
      </Link>,
    );
    last = at + m[0].length;
  }
  if (!out.length) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * The run-in head for an entry, drawn only from what the author wrote:
 * "Named riff: rest" gives "Named riff." + "Rest" (capitalised, so the
 * sentence after the head never starts in lowercase), and a short opening
 * question, "No lime? Rest", gives "No lime?" + "Rest". Anything else is
 * a plain sentence with no head.
 */
export function runIn(s: string): [string | null, string] {
  const colon = s.indexOf(':');
  if (colon > 0 && colon < 46) {
    const rest = s.slice(colon + 1).trim();
    return [`${s.slice(0, colon).trim()}.`, rest.charAt(0).toUpperCase() + rest.slice(1)];
  }
  const q = s.indexOf('?');
  if (q > 0 && q < 46) return [s.slice(0, q + 1), s.slice(q + 1).trim()];
  return [null, s];
}

function Entries({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className={heading}>{title}</h2>
      <ul>
        {items.map((item, i) => {
          const [term, rest] = runIn(item);
          return (
            <li key={i} className={`${body} py-3 border-b border-line last:border-b-0`}>
              {term && <b className="font-heading text-[18px] font-semibold">{term}</b>} {withLinks(rest)}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function SupplementarySections({ recipe }: { recipe: Recipe }) {
  const variations = recipe.variations ?? [];
  const substitutions = recipe.substitutions ?? [];
  const storage = recipe.storage;
  const tips = recipe.tips ?? [];

  if (!variations.length && !substitutions.length && !storage && !tips.length) return null;

  // Storage joins the shorter column, measured in characters of copy.
  const chars = (xs: string[]) => xs.reduce((n, x) => n + x.length, 0);
  const storageLeft = !!storage && variations.length > 0 && chars(variations) < chars(substitutions);

  // Below md the columns stack, so storage moved up beside the variations is
  // drawn again at the end there to keep the reading order.
  const storageSection = (className: string) => (
    <section className={className}>
      <h2 className={heading}>Storage &amp; reheating</h2>
      <p className={`${body} pt-3`}>{withLinks(storage ?? '')}</p>
    </section>
  );

  return (
    <div className="grid gap-y-10 md:grid-cols-2 md:gap-x-14">
      {variations.length > 0 && (
        <div className="min-w-0 space-y-10">
          <Entries title="Variations" items={variations} />
          {storageLeft && storageSection('hidden md:block')}
        </div>
      )}

      {(substitutions.length > 0 || storage) && (
        <div className="min-w-0 space-y-10">
          {substitutions.length > 0 && <Entries title="Substitutions" items={substitutions} />}
          {storage && storageSection(storageLeft ? 'md:hidden' : '')}
        </div>
      )}

      {tips.length > 0 && (
        <section className="md:col-span-2 rounded-[3px] bg-parchment-dark px-5 py-4 sm:px-6 sm:py-5">
          <h2 className="mb-3"><Eyebrow as="span" tone="paprika" className="block">Tips from the kitchen</Eyebrow></h2>
          <ol className="sm:columns-2 sm:gap-x-12">
            {tips.map((tip, i) => (
              <li key={i} className={`${body} relative pl-8 mb-3.5 break-inside-avoid`}>
                <span aria-hidden className="absolute left-0 top-0 font-heading text-lg font-normal tabular-nums text-paprika">
                  {i + 1}
                </span>
                {withLinks(tip)}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
