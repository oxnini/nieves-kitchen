'use client';

import { Utensils } from 'lucide-react';

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
      <div className="flex items-center gap-2 mb-2">
        <Utensils size={15} className="text-brown-medium" />
        <h2 className="font-heading text-[14px] font-semibold text-brown-dark uppercase tracking-wide">
          Equipment
        </h2>
      </div>
      <p className="text-[15px] text-brown-medium leading-relaxed">
        {items.join(' · ')}
      </p>
    </section>
  );
}
