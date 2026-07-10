import Link from 'next/link';
import { landedPantryEntries } from '@/lib/pantry/landed';
import CoverHero from '@/components/home/CoverHero';
import PromiseLine from '@/components/home/PromiseLine';
import PantryTeaser from '@/components/home/PantryTeaser';
import LatestFromKitchen from '@/components/home/LatestFromKitchen';
import WhereNext from '@/components/home/WhereNext';

/**
 * Design sandbox for the 2026-07-10 home cover redesign (approved variant E,
 * now shipped to app/page.tsx). Kept as the audition surface for candidate
 * cover photos (?img=1|2|3).
 *
 * Candidate cover photos for the audition. The winner gets
 * written to the recipe row's image_url at promotion; `undefined` means
 * "whatever the recipe row holds today".
 */
const COVER_PHOTO_CANDIDATES: Record<string, { label: string; src?: string }> = {
  '1': { label: 'Current (recipe row)' },
  '2': {
    label: 'Dark pan, prawns + scallions',
    src: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=2400&q=85',
  },
  '3': {
    label: 'Teal cloth, shrimp + tomatoes',
    src: 'https://images.unsplash.com/photo-1673789274287-5441868398cc?w=2400&q=85',
  },
};

export default async function DevHomeCoverPage({
  searchParams,
}: {
  searchParams: Promise<{ img?: string }>;
}) {
  const pantryEntries = landedPantryEntries();
  const { img } = await searchParams;
  const active = img && COVER_PHOTO_CANDIDATES[img] ? img : '3';

  return (
    <div className="pb-14 sm:pb-20">
      {/* Sandbox-only: audition cover photos. */}
      <div className="max-w-[84rem] mx-auto px-4 sm:px-8 pt-3 flex flex-wrap items-center gap-2">
        <span className="font-stamp text-[10px] uppercase tracking-[0.2em] text-brown-medium/70">
          Cover photo:
        </span>
        {Object.entries(COVER_PHOTO_CANDIDATES).map(([key, c]) => (
          <Link
            key={key}
            href={`/dev/home-cover?img=${key}`}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              key === active
                ? 'border-terracotta text-terracotta'
                : 'border-brown-light/40 text-brown-medium hover:text-brown-dark'
            }`}
          >
            {key}. {c.label}
          </Link>
        ))}
      </div>

      <div className="max-w-[84rem] mx-auto px-4 sm:px-8 pt-4 sm:pt-6">
        <CoverHero
          pantryEntries={pantryEntries}
          imageOverride={COVER_PHOTO_CANDIDATES[active].src}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24 space-y-14 sm:space-y-20">
        <PromiseLine />
        <PantryTeaser entries={pantryEntries} />
        <LatestFromKitchen />
        <WhereNext />
      </div>
    </div>
  );
}
