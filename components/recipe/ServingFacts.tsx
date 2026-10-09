'use client';

import type { Recipe } from '@/lib/types';

/**
 * Per-serving nutrition under the facts row, in the recipe header: a
 * semibold heading and the four figures in Newsreader, set apart from the
 * ruled facts row by space rather than more rules or boxes. The dietary line
 * follows. Picked in /dev/recipe-header (audit F2, spec 2026-09-25 §8).
 *
 * Nutrition is always per serving and never scales with the servings stepper:
 * the stepper scales ingredient amounts, but a portion's macros stay constant.
 */
export default function ServingFacts({ recipe, inModal = false }: { recipe: Recipe; inModal?: boolean }) {
  // Vegan supersedes Vegetarian; render only the strictest applicable badge.
  const dietary: string[] = [];
  if (recipe.isVegan) dietary.push('Vegan');
  else if (recipe.isVegetarian) dietary.push('Vegetarian');
  if (recipe.isGlutenFree) dietary.push('Gluten-Free');
  if (recipe.isDairyFree && !recipe.isVegan) dietary.push('Dairy-Free');

  const items = [
    { label: 'kcal', value: `${Math.round(recipe.nutrition.calories)}` },
    { label: 'protein', value: `${Math.round(recipe.nutrition.protein)} g` },
    { label: 'carbs', value: `${Math.round(recipe.nutrition.carbs)} g` },
    { label: 'fat', value: `${Math.round(recipe.nutrition.fat)} g` },
  ];

  return (
    <section aria-labelledby="per-serving" className="mt-6">
      {/* The h2 carries the semantics; the span carries the look (the global
          h2 rule is unlayered, so it would beat a font-body utility on the h2). */}
      <h2 id="per-serving" className="mb-1.5">
        <span className="font-body text-[14px] font-semibold tracking-normal text-brown-dark">
          Per serving <span className="font-normal text-brown-medium">· approx.</span>
        </span>
      </h2>
      {/* Sized so all four stay on one line in a 358px phone column and the
          ~390px text column of the 880px modal; the full page has room for
          the larger figures. */}
      <dl className={`flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-5 ${inModal ? '' : 'md:gap-x-8'}`}>
        {items.map((n) => (
          <div key={n.label} className="flex flex-row-reverse items-baseline gap-1.5">
            <dt className="text-[14px] text-brown-dark">{n.label}</dt>
            <dd
              className={`font-heading font-medium text-[22px] sm:text-[24px] leading-none text-brown-dark ${inModal ? '' : 'md:text-[26px]'}`}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {n.value}
            </dd>
          </div>
        ))}
      </dl>
      {dietary.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {dietary.map((label) => (
            <li key={label} className="inline-flex items-center gap-1.5 text-[13px] text-brown-medium">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-sage shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
