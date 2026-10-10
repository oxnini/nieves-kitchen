'use client';

/**
 * The real recipe page with its hero swapped for the A or B compare slot
 * (or C) saved in `/dev/hero-crop`. `?v=b` opens on a slot. Navigate to `/dev/hero-crop/compare?slug=<slug>`.
 * Resize the window below 768px to see the phone layout.
 */

import { useEffect, useState } from 'react';

const VARIANTS = ['a', 'b', 'c'] as const;
type Variant = (typeof VARIANTS)[number];
import RecipeDetail from '@/components/RecipeDetail';
import { useRecipes } from '@/hooks/useRecipes';

export default function HeroCropComparePage() {
  const { data: recipes } = useRecipes();
  const [slug, setSlug] = useState('');
  const [variant, setVariant] = useState<Variant>('a');
  // `?bare=1` hides the toggle, for the side-by-side frames in ../trio.
  const [bare, setBare] = useState(false);
  // Busts the dev image optimizer's cache, which keys on the URL, so a slot
  // re-saved in the editor shows its new crop after a reload here.
  const [version] = useState(() => Date.now());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get('slug') ?? '');
    const v = params.get('v');
    if (VARIANTS.includes(v as Variant)) setVariant(v as Variant);
    setBare(params.get('bare') === '1');
  }, []);

  const recipe = recipes?.find((r) => r.id === slug);

  return (
    <>
      {!bare && (
        <div className="sticky top-[var(--nav-h)] z-40 flex justify-center gap-2 py-2">
          {VARIANTS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`rounded-full border px-5 py-1.5 text-sm shadow-sm ${
                variant === v ? 'border-teal bg-teal text-white' : 'border-line bg-surface text-brown-dark'
              }`}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      {recipe ? (
        <RecipeDetail
          key={variant}
          recipe={{ ...recipe, image: `/recipes/${slug}-hero-${variant}.webp?v=${version}` }}
        />
      ) : (
        <p className="p-8 text-center text-brown-medium">{recipes ? `No recipe "${slug}"` : 'Loading…'}</p>
      )}
    </>
  );
}
