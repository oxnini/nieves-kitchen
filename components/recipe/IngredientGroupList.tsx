'use client';

import type { Ingredient, IngredientGroup } from '@/lib/types';

interface Props {
  groups: IngredientGroup[];
  displayAmount: (ing: Ingredient) => string;
  isChecked: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => boolean;
  toggle: (type: 'ingredients' | 'steps', groupIndex: number, itemIndex: number) => void;
}

/**
 * Grouped ingredient rendering. Renders nothing more than a flat list when
 * the recipe has a single ungrouped section, so simple recipes look the
 * same as they did before grouping existed.
 */
export default function IngredientGroupList({
  groups,
  displayAmount,
  isChecked,
  toggle,
}: Props) {
  const showHeadings = groups.length > 1 || !!groups[0]?.heading;

  return (
    <div>
      {groups.map((group, gIdx) => {
        const heading = group.heading?.trim();
        return (
          <div
            key={`${gIdx}-${heading ?? 'group'}`}
            className={gIdx > 0 ? 'mt-3' : ''}
          >
            {showHeadings && heading && (
              <h3 className="pt-3 mb-0.5 font-heading italic font-normal text-[17px] text-brown-medium">
                {heading}
              </h3>
            )}
            {group.items.map((ing, i) => {
              const checked = isChecked('ingredients', gIdx, i);
              return (
                <label
                  key={`${ing.name}-${i}`}
                  className={`flex items-center justify-between text-base py-2 border-b border-line cursor-pointer transition-opacity ${
                    checked ? 'opacity-50' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle('ingredients', gIdx, i)}
                      className="editorial-check"
                    />
                    <span className={checked ? 'line-through' : ''}>
                      {ing.name}
                    </span>
                  </span>
                  <span className={`text-brown-medium font-medium tabular-nums ml-4 shrink-0 ${
                    checked ? 'line-through' : ''
                  }`}>
                    {displayAmount(ing)}
                  </span>
                </label>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
