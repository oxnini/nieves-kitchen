'use client';

/**
 * /dev/stamp-modal — the journal's StampedRecipesModal on fixtures, open by
 * default, with a no-op remove so the per-cook trash control renders. The
 * real /journal needs a Supabase session; this needs nothing.
 */

import { useState } from 'react';
import PaperTexture from '@/components/passport/PaperTexture';
import StampedRecipesModal from '@/components/passport/StampedRecipesModal';
import type { Stamp } from '@/lib/passport';
import type { Recipe } from '@/lib/types';
import { FIXTURE_RECIPES } from '../journal/fixtures';

const base = FIXTURE_RECIPES[0];
const RECIPES: Recipe[] = [
  { ...base, id: 'shakshuka', name: 'Shakshuka' },
  { ...base, id: 'lahmacun', name: 'Lahmacun' },
  { ...base, id: 'menemen', name: 'Menemen' },
];

const stamp = (id: string, slug: string, cooked_at: string): Stamp => ({
  id, recipe_slug: slug, recipe_country: 'Turkey', cooked_at,
});

const STAMPS = new Map<string, Stamp[]>([
  ['shakshuka', [
    stamp('s1', 'shakshuka', '2026-07-02T18:00:00.000Z'),
    stamp('s2', 'shakshuka', '2026-08-14T18:00:00.000Z'),
    stamp('s3', 'shakshuka', '2026-09-26T18:00:00.000Z'),
  ]],
  ['lahmacun', [stamp('s4', 'lahmacun', '2026-09-20T18:00:00.000Z')]],
]);

export default function StampModalPreview() {
  const [open, setOpen] = useState(true);
  return (
    <main className="min-h-screen bg-parchment p-10">
      <PaperTexture />
      <button type="button" onClick={() => setOpen(true)} className="underline">
        Open modal
      </button>
      {open && (
        <StampedRecipesModal
          country="Turkey"
          recipes={RECIPES}
          stampsByRecipe={STAMPS}
          onRemoveStamp={() => new Promise(() => {})}
          onClose={() => setOpen(false)}
        />
      )}
    </main>
  );
}
