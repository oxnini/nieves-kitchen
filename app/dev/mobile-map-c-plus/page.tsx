'use client';

/**
 * Spike: Option C+ mobile map.
 *
 * - Landscape (1600x900) viewBox so a portrait phone sees a horizontal
 *   strip of the world by default — no top/bottom whitespace.
 * - East/west wrap via triple-rendered world copies + lng-normalisation
 *   in handleMoveEnd. Pan past the edge and the next continent slides in.
 * - Thin region rail at the bottom is the accessibility/escape valve;
 *   the map is primary. Active region auto-tracks the pan centre.
 * - First-visit coachmark teaches "swipe to wander, double-tap to dive in"
 *   and auto-dismisses on first pan or after 3s.
 *
 * Not linked from anywhere; navigate to /dev/mobile-map-c-plus.
 * Best viewed on a phone (or DevTools at iPhone-class viewport).
 */

import MobileMapCPlus from '@/components/dev/MobileMapCPlus';
import { useRecipes } from '@/hooks/useRecipes';

export default function MobileMapCPlusDevPage() {
  const { data: recipes = [] } = useRecipes();
  return <MobileMapCPlus recipes={recipes} />;
}
