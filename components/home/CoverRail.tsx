import Link from 'next/link';
import Image from 'next/image';
import { COLLECTIONS, COLLECTION_ACCENTS } from '@/lib/collections';
import type { Recipe } from '@/lib/types';
import type { PantryEntry } from '@/data/pantry';
import PropheticSeal from '@/components/pantry/PropheticSeal';

/** Small-caps Cutive label above each rail block. */
function RailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-stamp text-[10px] uppercase tracking-[0.3em] text-brown-medium/80 mb-3">
      {children}
    </p>
  );
}

/**
 * The cover's utility rail: three parchment blocks separated by hairline
 * rules. Everything here is derived (collections from lib/collections, the
 * two newest non-cover recipes, the first three landed pantry entries), so
 * publishing a new cover never requires editing the rail.
 */
export default function CoverRail({
  moreToCook,
  pantryEntries,
}: {
  moreToCook: Recipe[];
  pantryEntries: PantryEntry[];
}) {
  const chips = pantryEntries.slice(0, 3);

  return (
    <aside aria-label="Kitchen index" className="flex flex-col divide-y divide-brown-light/25">
      <div className="pb-5">
        <RailLabel>The Collections</RailLabel>
        <ul className="space-y-2.5">
          {COLLECTIONS.map((c) => (
            <li key={c.slug}>
              <Link
                href={c.href}
                className="group flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta rounded-sm"
              >
                <span
                  aria-hidden="true"
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${COLLECTION_ACCENTS[c.slug].bar}`}
                />
                <span className="font-heading font-medium text-sm text-brown-dark leading-snug group-hover:text-terracotta transition-colors">
                  {c.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {moreToCook.length > 0 && (
        <div className="py-5">
          <RailLabel>More to cook</RailLabel>
          <ul className="space-y-3">
            {moreToCook.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/recipes/${encodeURIComponent(r.id)}`}
                  className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta rounded-xl"
                >
                  <span className="relative w-[4.6rem] h-[4.6rem] rounded-xl overflow-hidden bg-parchment-dark shrink-0">
                    <Image src={r.image} alt="" fill sizes="74px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading font-semibold text-sm text-brown-dark leading-snug group-hover:text-terracotta transition-colors">
                      {r.name}
                    </span>
                    <span className="mt-1 block font-stamp text-[10px] uppercase tracking-[0.16em] text-brown-medium nums-tabular">
                      {r.time.total} min{r.country ? ` · ${r.country}` : ''}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {chips.length > 0 && (
        <div className="pt-5">
          <RailLabel>From the Pantry</RailLabel>
          <ul className="flex gap-3">
            {chips.map((e) => (
              <li key={e.slug}>
                <Link
                  href="/pantry"
                  aria-label={`${e.name}, in the pantry`}
                  className="relative block w-[5.4rem] bg-plinth rounded-xl ring-1 ring-brown-dark/8 p-2 hover:ring-terracotta/40 transition-[box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  <span className="relative block w-full aspect-square">
                    <Image src={e.artSrc} alt="" fill sizes="87px" className="object-contain" />
                  </span>
                  {e.prophetic && (
                    <span className="absolute -top-1.5 -right-1.5"><PropheticSeal size={16} /></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
