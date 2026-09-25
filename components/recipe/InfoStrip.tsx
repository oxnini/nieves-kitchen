'use client';

import dynamic from 'next/dynamic';
import type { Recipe } from '@/lib/types';
import { Eyebrow } from '@/components/courtyard';

function FlavorCompassSkeleton() {
  // Preserves the chart's footprint (square, ~min-h-[160px]) so swapping in the
  // real radar chart does not shift surrounding layout. Parchment-on-parchment
  // so the placeholder stays quiet on the page.
  return (
    <div
      aria-hidden="true"
      className="w-full h-full min-h-[160px] aspect-square rounded-lg bg-parchment/70 flex items-center justify-center"
    >
      <div className="w-3/4 aspect-square rounded-full border border-brown-light/20 animate-pulse" />
    </div>
  );
}

const FlavorCompass = dynamic(() => import('../FlavorCompass'), {
  ssr: false,
  loading: () => <FlavorCompassSkeleton />,
});

function DietaryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-brown-medium">
      <span
        aria-hidden="true"
        className="w-2 h-2 rounded-full bg-sage shrink-0"
      />
      {label}
    </span>
  );
}

/**
 * The info block under the lede, on the page paper (no card): dietary line,
 * per-serving nutrition tiles, tags and the flavour compass. Times live in the
 * facts row under the title, and servings in the ingredients stepper.
 */
export default function InfoStrip({ recipe }: { recipe: Recipe }) {
  // Vegan supersedes Vegetarian; render only the strictest applicable badge.
  const dietary: string[] = [];
  if (recipe.isVegan) dietary.push('Vegan');
  else if (recipe.isVegetarian) dietary.push('Vegetarian');
  if (recipe.isGlutenFree) dietary.push('Gluten-Free');
  if (recipe.isDairyFree && !recipe.isVegan) dietary.push('Dairy-Free');

  // Nutrition is always per serving and never scales with the servings stepper.
  // The stepper scales ingredient amounts, but a portion's macros stay constant.
  const nutritionItems = [
    { label: 'kcal',    value: `${Math.round(recipe.nutrition.calories)}` },
    { label: 'protein', value: `${Math.round(recipe.nutrition.protein)} g` },
    { label: 'carbs',   value: `${Math.round(recipe.nutrition.carbs)} g` },
    { label: 'fat',     value: `${Math.round(recipe.nutrition.fat)} g` },
  ];

  return (
    <div className="mb-10">
      {/* Dietary badges */}
      {dietary.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
          {dietary.map(label => <DietaryBadge key={label} label={label} />)}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Nutrition + Tags */}
        <div className="flex-1 min-w-0">
          <h2 className="mb-2.5"><Eyebrow as="span" className="block">Per serving · approx.</Eyebrow></h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {nutritionItems.map(n => (
              <div
                key={n.label}
                className="bg-parchment ring-1 ring-line rounded-[3px] px-2.5 py-3 text-center text-[12.5px] text-brown-medium"
              >
                <div
                  className="font-heading font-normal text-[24px] leading-[1.1] text-brown-dark"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {n.value}
                </div>
                {n.label}
              </div>
            ))}
          </div>
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {recipe.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[13px] font-medium px-3 py-1 rounded-full ring-1 ring-line text-brown-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Flavor Compass */}
        <div className="w-full md:w-56 shrink-0 flex items-center justify-center">
          <FlavorCompass profile={recipe.flavorProfile} />
        </div>
      </div>
    </div>
  );
}
