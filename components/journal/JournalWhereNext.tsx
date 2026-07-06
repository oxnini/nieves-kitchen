import Link from 'next/link';
import type { Recommendation } from '@/lib/passport-recommend';

export interface JournalWhereNextProps {
  recommendation: Recommendation | null;
}

/**
 * One "where next?" invitation card at the foot of the journal, sampled from
 * `recommendNextRecipes(..., 1)`. Renders nothing when there is no
 * recommendation (nothing left to suggest, or the dev route passed no recipe
 * pool) — never a placeholder. This is the Atlas's forward pull, tasted once.
 */
export default function JournalWhereNext({ recommendation }: JournalWhereNextProps) {
  if (!recommendation) return null;
  const { recipe } = recommendation;

  return (
    <section className="flex flex-wrap items-center gap-5 rounded-lg border border-dashed border-brown-light/50 p-5 sm:p-6">
      <div className="min-w-[15rem] flex-1">
        <div className="font-stamp text-[9px] uppercase tracking-[0.2em] text-terracotta">
          Where next?
        </div>
        <div className="mt-1 font-heading text-xl text-brown-dark">{recipe.name}</div>
        <p className="mt-1 font-body text-sm text-brown-medium">{reasonCopy(recommendation)}</p>
      </div>
      <Link
        href={`/recipes/${encodeURIComponent(recipe.id)}`}
        className="whitespace-nowrap rounded-full border border-terracotta px-4 py-2 font-stamp text-[10px] uppercase tracking-wider text-terracotta transition-colors hover:bg-terracotta hover:text-parchment"
      >
        Open recipe →
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
