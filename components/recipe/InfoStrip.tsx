'use client';

import dynamic from 'next/dynamic';
import { Clock, Timer, Gauge } from 'lucide-react';
import type { Recipe } from '@/lib/types';

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

function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

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

export default function InfoStrip({
  recipe,
  servings,
}: {
  recipe: Recipe;
  servings: number;
}) {
  const { active, total, resting } = recipe.time;

  // Vegan supersedes Vegetarian; render only the strictest applicable badge.
  const dietary: string[] = [];
  if (recipe.isVegan) dietary.push('Vegan');
  else if (recipe.isVegetarian) dietary.push('Vegetarian');
  if (recipe.isGlutenFree) dietary.push('Gluten-Free');
  if (recipe.isDairyFree && !recipe.isVegan) dietary.push('Dairy-Free');

  const yieldLine = recipe.yieldText
    ? `Makes ${recipe.yieldText} · Serves ${servings}`
    : `Serves ${servings}`;

  // Nutrition is always per serving and never scales with the servings stepper.
  // The stepper scales ingredient amounts, but a portion's macros stay constant.
  const nutritionItems = [
    { label: 'Calories', value: Math.round(recipe.nutrition.calories), unit: 'kcal' },
    { label: 'Protein',  value: Math.round(recipe.nutrition.protein),  unit: 'g'    },
    { label: 'Carbs',    value: Math.round(recipe.nutrition.carbs),    unit: 'g'    },
    { label: 'Fat',      value: Math.round(recipe.nutrition.fat),      unit: 'g'    },
  ];

  return (
    <div className="bg-surface rounded-2xl p-5 mb-10 border border-brown-light/10">
      {/* Time chips */}
      <div className="flex flex-wrap gap-2 text-[13px] text-brown-medium mb-3">
        <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
          <Clock size={14} /> Active {formatDuration(active)}
        </span>
        <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
          <Timer size={14} /> Total {formatDuration(total)}
        </span>
        {resting && resting > 0 ? (
          <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
            <Clock size={14} /> Rest {formatDuration(resting)}
          </span>
        ) : null}
        <span className="flex items-center gap-1.5 bg-parchment px-3 py-1.5 rounded-full">
          <Gauge size={14} /> {recipe.difficulty}
        </span>
      </div>

      {/* Yield line */}
      <p className="text-[13px] text-brown-medium mb-3">
        {yieldLine}
      </p>

      {/* Dietary badges */}
      {dietary.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
          {dietary.map(label => <DietaryBadge key={label} label={label} />)}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Nutrition + Tags */}
        <div className="flex-1">
          <h2 className="font-heading text-[13px] font-semibold text-brown-dark mb-2 uppercase tracking-wide">
            Nutrition
            <span className="ml-1.5 text-[11px] font-normal normal-case tracking-normal text-brown-medium">
              (per serving, approx.)
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {nutritionItems.map(n => (
              <div key={n.label} className="bg-parchment rounded-lg px-3 py-2 text-center">
                <div className="text-[11px] uppercase tracking-[0.1em] text-brown-medium mb-0.5">
                  {n.label}
                </div>
                <div
                  className="font-heading text-xl text-brown-dark"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {n.value}
                  <span className="text-[13px] text-brown-medium ml-0.5">{n.unit}</span>
                </div>
              </div>
            ))}
          </div>
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {recipe.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[13px] font-medium px-3 py-1 rounded-full bg-parchment text-brown-medium"
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
