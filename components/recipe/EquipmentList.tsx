'use client';

import { Utensils } from 'lucide-react';
import { Eyebrow } from '@/components/courtyard';

/**
 * Compact inline list of genuinely special tools only (a way to steam, an oven
 * dish), framed by function with everyday alternatives. Everyday items (bowls,
 * spoons) and over-specific gear are deliberately kept out of the data, so this
 * stays a reassurance rather than a shopping list. Hidden when empty so simple
 * recipes don't gain a row of padding. See the `equipment` doc in
 * `data/recipes/_types.ts` for the authoring rule.
 */
export default function EquipmentList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-10 max-w-prose">
      {/* The h2 carries the semantics; the Eyebrow span carries the look
          (the global h2 rule would otherwise force Newsreader onto it). */}
      <h2 className="flex items-center gap-2 mb-2">
        <Utensils size={15} className="text-terracotta" aria-hidden="true" />
        <Eyebrow as="span">Equipment</Eyebrow>
      </h2>
      <p className="text-[15px] text-brown-medium leading-relaxed">
        {items.join(' · ')}
      </p>
    </section>
  );
}
