'use client';

import Link from 'next/link';
import { GitBranch, RefreshCw, Archive } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { Eyebrow } from '@/components/courtyard';

/**
 * Read-mode back matter: Variations, Substitutions, Storage & Reheating, Tips.
 *
 * Rendered as paper panels (surface fill, a hairline ring, 3px corners, no
 * shadow). Typography carries the hierarchy: a Newsreader heading at weight
 * 400 with its icon in terracotta, and each section keeps a structure suited
 * to its content: Variations as a titled glossary, Substitutions as a swap
 * list, Storage as a plain paragraph. Tips are the margin note: a tinted box
 * with an eyebrow label, numbered notes inside, last in the back matter.
 */

const body = 'font-body text-[16px] sm:text-[17px] text-brown-dark leading-[1.7]';

/**
 * Render `[label](/path)` in back-matter copy as an in-app link, leaving the
 * rest of the string as plain text. Deliberately internal-only: an href must
 * start with a single `/`, so recipe copy can point at another recipe (a
 * variation that reuses leftovers from one, say) but can never smuggle an
 * off-site or `javascript:` URL into the page.
 */
const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

function withLinks(text: string): React.ReactNode {
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

/** Split a "Named riff: description" entry into [term, rest] for the glossary. */
function splitTerm(s: string): [string | null, string] {
  const idx = s.indexOf(':');
  if (idx > 0 && idx < 46) return [s.slice(0, idx).trim(), s.slice(idx + 1).trim()];
  return [null, s];
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[3px] bg-surface ring-1 ring-line p-6 sm:p-8">
      <h2 className="font-heading text-[22px] font-normal text-brown-dark mb-5 flex items-center gap-2.5">
        <Icon size={19} strokeWidth={2.25} className="text-terracotta" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SupplementarySections({ recipe }: { recipe: Recipe }) {
  const variations = recipe.variations ?? [];
  const substitutions = recipe.substitutions ?? [];
  const storage = recipe.storage;
  const tips = recipe.tips ?? [];

  if (!variations.length && !substitutions.length && !storage && !tips.length) return null;

  return (
    <div className="space-y-5 max-w-[70ch]">
      {variations.length > 0 && (
        <Panel icon={GitBranch} title="Variations">
          <dl className="space-y-4">
            {variations.map((item, i) => {
              const [term, rest] = splitTerm(item);
              return (
                <div key={i}>
                  {term && (
                    <dt className="font-heading text-[17px] font-semibold text-brown-dark">{term}</dt>
                  )}
                  <dd className={`${body} ${term ? 'mt-0.5' : ''}`}>{withLinks(rest)}</dd>
                </div>
              );
            })}
          </dl>
        </Panel>
      )}

      {substitutions.length > 0 && (
        <Panel icon={RefreshCw} title="Substitutions">
          <ul className="space-y-3.5">
            {substitutions.map((sub, i) => (
              <li key={i} className={`${body} relative pl-6`}>
                <span aria-hidden className="absolute left-0 top-0 font-stamp text-lg leading-[1.35] text-terracotta">
                  &#8644;
                </span>
                {withLinks(sub)}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {storage && (
        <Panel icon={Archive} title="Storage & reheating">
          <p className={body}>{withLinks(storage)}</p>
        </Panel>
      )}

      {tips.length > 0 && (
        <section className="rounded-[3px] bg-parchment-dark px-5 py-4">
          <h2 className="mb-3"><Eyebrow as="span" tone="paprika" className="block">Tips from the kitchen</Eyebrow></h2>
          <ol className="space-y-3.5">
            {tips.map((tip, i) => (
              <li key={i} className={`${body} relative pl-8`}>
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
