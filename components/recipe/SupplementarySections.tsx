'use client';

import { GitBranch, RefreshCw, Archive, Lightbulb } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Recipe } from '@/lib/types';

/**
 * Read-mode back matter: Variations, Substitutions, Storage & Reheating, Tips.
 *
 * Rendered as soft parchment panels (faint fill + soft lift, no border) rather
 * than the old four-identical filled cards. Typography carries the hierarchy —
 * a confident terracotta heading per panel, and each section keeps a structure
 * suited to its content: Variations as a titled glossary, Substitutions as a
 * swap list, Storage as a plain paragraph, Tips as numbered notes.
 */

const body = 'font-body text-[16px] sm:text-[17px] text-brown-dark leading-[1.7]';

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
    <section className="rounded-[20px] bg-surface/70 p-6 sm:p-8 shadow-[0_2px_10px_rgba(60,42,28,0.05)]">
      <h2 className="font-heading text-[22px] font-bold text-terracotta mb-5 flex items-center gap-2.5">
        <Icon size={19} strokeWidth={2.25} />
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
                  <dd className={`${body} ${term ? 'mt-0.5' : ''}`}>{rest}</dd>
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
                {sub}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {storage && (
        <Panel icon={Archive} title="Storage & Reheating">
          <p className={body}>{storage}</p>
        </Panel>
      )}

      {tips.length > 0 && (
        <Panel icon={Lightbulb} title="Tips from the kitchen">
          <ol className="space-y-3.5">
            {tips.map((tip, i) => (
              <li key={i} className={`${body} relative pl-8`}>
                <span aria-hidden className="absolute left-0 top-0 font-heading text-lg font-bold tabular-nums text-terracotta">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </div>
  );
}
