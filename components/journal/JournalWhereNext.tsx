import Link from 'next/link';
import { Eyebrow } from '@/components/courtyard/Eyebrow';
import type { Recommendation } from '@/lib/passport-recommend';

export interface JournalWhereNextProps {
  recommendation: Recommendation | null;
}

/**
 * One "where next?" invitation at the foot of the journal (Phase 8 restyle,
 * R109), sampled from `recommendNextRecipes(..., 1)`. A single ruled line —
 * eyebrow, dish, muted reason, and a teal "Open recipe" link pushed right on
 * desktop (left on phones). Renders nothing when there is no recommendation
 * (nothing left to suggest, or the dev route passed no recipe pool) — never
 * a placeholder. This is the Atlas's forward pull, tasted once.
 */
export default function JournalWhereNext({ recommendation }: JournalWhereNextProps) {
  if (!recommendation) return null;
  const { recipe } = recommendation;

  return (
    <section className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2 border-t border-brown-dark border-b border-line py-[18px] text-base">
      <Eyebrow as="span" className="shrink-0">Where next?</Eyebrow>
      <span className="font-heading font-normal text-[21px] text-brown-dark">{recipe.name}</span>
      <span className="font-body text-brown-medium">{reasonCopy(recommendation)}</span>
      <Link
        href={`/recipes/${encodeURIComponent(recipe.id)}`}
        className="font-body text-base font-medium text-teal underline underline-offset-4 whitespace-nowrap ml-0 sm:ml-auto"
      >
        Open recipe
      </Link>
    </section>
  );
}

function reasonCopy(rec: Recommendation): string {
  const { recipe, reason } = rec;
  switch (reason) {
    case 'new-region':
      return `A new region for you${recipe.region ? `, ${recipe.region}` : ''}. One dish opens a whole corner of the map.`;
    case 'new-country':
      return `Your first from ${recipe.country ?? 'somewhere new'}.`;
    case 'revisit':
      return `Back to ${recipe.country ?? 'a favorite'}, with a dish you haven${'’'}t tried yet.`;
  }
}
