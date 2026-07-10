import Link from 'next/link';
import { PROTEIN_CHIP_THRESHOLD } from '@/lib/collections';
import type { Recipe } from '@/lib/types';

/**
 * The table card: a physical paper card laid on the cover photo, overhanging
 * its bottom edge on desktop, pulled up over the photo on mobile. Locked
 * paper like the passport: plinth background, ink #1E4854, terracotta
 * #CE6B39; it does not change when the theme dims (arbitrary-hex classes
 * are untouched by the sepia overrides in globals.css).
 */
export default function CoverTableCard({ recipe, monthYear }: { recipe: Recipe; monthYear: string }) {
  return (
    <div className="cover-card-enter relative z-10 -mt-[3.4rem] mx-4 min-[860px]:absolute min-[860px]:left-[1.8rem] min-[860px]:bottom-[-1.4rem] min-[860px]:mt-0 min-[860px]:mx-0 min-[860px]:max-w-[26rem] bg-plinth rounded-2xl p-6 sm:p-7 shadow-[0_18px_40px_rgba(16,26,28,0.35)]">
      <p className="font-stamp text-[10px] uppercase tracking-[0.28em] text-[#1E4854] pb-2 border-b-[3px] border-double border-[#1E4854]/40">
        On the table · {monthYear}
      </p>
      <h2 className="mt-3 font-heading font-bold leading-tight text-[clamp(1.45rem,2vw,1.9rem)]">
        <Link
          href={`/recipes/${encodeURIComponent(recipe.id)}`}
          className="text-[#1E4854] hover:text-[#CE6B39] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CE6B39]"
        >
          {recipe.name}
        </Link>
      </h2>
      <p className="mt-2 font-stamp text-[11px] uppercase tracking-[0.18em] text-[#1E4854]/75 nums-tabular">
        {recipe.time.total} min
        {recipe.nutrition.protein >= PROTEIN_CHIP_THRESHOLD && (
          <> · {recipe.nutrition.protein}g protein</>
        )}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/recipes/${encodeURIComponent(recipe.id)}`}
          className="inline-flex items-center rounded-full px-5 py-2.5 font-heading font-semibold text-sm bg-[#CE6B39] text-[#F5F0E4] hover:bg-[#B85A2E] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4854]"
        >
          Cook it tonight
        </Link>
        <Link
          href="/recipes"
          className="inline-flex items-center rounded-full px-5 py-2.5 font-heading font-semibold text-sm border-[1.5px] border-[#1E4854]/50 text-[#1E4854] hover:bg-[#1E4854] hover:text-[#F5F0E4] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CE6B39]"
        >
          Browse all recipes
        </Link>
      </div>
    </div>
  );
}
