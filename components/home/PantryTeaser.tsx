import Link from 'next/link';
import Image from 'next/image';
import type { PantryEntry } from '@/data/pantry';
import PropheticSeal from '@/components/pantry/PropheticSeal';
import DepartmentHeader from '@/components/home/DepartmentHeader';

/**
 * Home teaser for The Pantry: a row of ink stamps on parchment plinths,
 * sealed where an entry carries a prophetic narration, linking through to
 * /pantry. A server component so it draws from the same "art has landed"
 * truth as the shelf (`app/pantry/page.tsx` passes the resolved entries down).
 */
export default function PantryTeaser({ entries }: { entries: PantryEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="pantry-teaser-heading">
      <DepartmentHeader
        id="pantry-teaser-heading"
        label="From the Pantry"
        link={{ href: '/pantry', label: 'The whole pantry' }}
      />

      <Link
        href="/pantry"
        className="group block rounded-2xl border border-brown-light/25 bg-surface p-5 sm:p-6 hover:border-terracotta/40 hover:shadow-md transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <ul className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {entries.map((e) => (
            <li key={e.slug} className="flex flex-col items-center gap-2 text-center">
              <span className="relative bg-plinth rounded-xl ring-1 ring-brown-dark/8 p-2">
                <span className="relative block w-16 h-16 sm:w-20 sm:h-20">
                  <Image
                    src={e.artSrc}
                    alt={e.name}
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-contain"
                  />
                </span>
                {e.prophetic && (
                  <span className="absolute -top-1 -right-1"><PropheticSeal size={18} /></span>
                )}
              </span>
              <span className="font-stamp text-[10px] uppercase tracking-[0.18em] text-brown-medium">
                {e.name}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-brown-medium leading-relaxed">
          The ingredients this kitchen leans on. The sealed ones come with a story.
        </p>
      </Link>
    </section>
  );
}
