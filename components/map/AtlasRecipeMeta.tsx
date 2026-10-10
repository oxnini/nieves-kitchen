'use client';

import { Fragment, type ReactNode } from 'react';

import { formatMinutes } from '@/lib/recipes/format';
import type { Recipe } from '@/lib/types';

/**
 * The meta line under a recipe title on the atlas (desktop sidebar card and
 * mobile bottom-sheet row): "Italy ◆ 30 min ◆ Medium ◆ Fusion". Same
 * language as the /recipes browse card: 13px muted ink, terracotta diamond
 * separators, Fusion as the one terracotta word. Replaces the old difficulty
 * and Fusion pills, whose dark ink on terracotta read 2.95:1 by day.
 */
export default function AtlasRecipeMeta({ recipe, showCountry = false }: { recipe: Recipe; showCountry?: boolean }) {
  const items: { key: string; node: ReactNode }[] = [];
  if (showCountry && recipe.country) {
    items.push({ key: 'place', node: <span className="truncate">{recipe.country}</span> });
  }
  items.push({ key: 'time', node: <span className="nums-tabular shrink-0">{formatMinutes(recipe.time.total)}</span> });
  items.push({ key: 'difficulty', node: <span className="shrink-0">{recipe.difficulty}</span> });
  if (recipe.isFusion) {
    items.push({ key: 'fusion', node: <span className="shrink-0 text-terracotta">Fusion</span> });
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-brown-medium">
      {items.map((item, i) => (
        <Fragment key={item.key}>
          {i > 0 && <span aria-hidden="true" className="inline-block h-1 w-1 shrink-0 rotate-45 bg-terracotta" />}
          {item.node}
        </Fragment>
      ))}
    </div>
  );
}
