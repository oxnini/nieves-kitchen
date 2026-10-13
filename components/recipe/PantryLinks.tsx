'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/courtyard';
import type { PantryPlate } from '@/data/pantry';

/**
 * "From the pantry": a small plate for each of the recipe's featured
 * ingredients that has landed in the pantry, each opening its entry on
 * /pantry (spec 2026-09-25 §8, audit F10). The drawing sits on the page by
 * day and on the warm plinth at night (`.ink-plinth`), as on the pantry grid.
 * The server pages resolve which entries have art, so this only draws.
 */
export default function PantryLinks({ plates }: { plates: PantryPlate[] }) {
  if (plates.length === 0) return null;

  return (
    <section>
      {/* The h2 carries the semantics; the Eyebrow span carries the look
          (the global h2 rule would otherwise force Newsreader onto it). */}
      <h2 className="mb-2.5">
        <Eyebrow as="span">From the pantry</Eyebrow>
      </h2>
      <ul className="flex flex-wrap gap-2.5">
        {plates.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/pantry?entry=${encodeURIComponent(p.slug)}`}
              aria-label={`${p.name}, in the pantry`}
              className="group block w-[76px] text-center rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:w-[88px]"
            >
              <span className="ink-plinth relative block h-[76px] w-[76px] rounded-[3px] ring-1 ring-line transition-shadow group-hover:ring-brown-light sm:h-[88px] sm:w-[88px]">
                <Image src={p.artSrc} alt="" fill sizes="88px" className="object-contain p-2" />
              </span>
              <span className="mt-1.5 block font-heading text-[16px] leading-tight text-brown-dark group-hover:underline group-hover:underline-offset-4">
                {p.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
