'use client';

import WorldMapDesktop from './WorldMapDesktop';
import type { Recipe } from '@/lib/types';

interface Props {
  recipes: Recipe[];
  isLoading?: boolean;
  flyTo?: { lng: number; lat: number; zoom?: number };
}

/** Mobile world map. Currently a passthrough to the desktop component;
 *  real mobile UI is built in Task 6 onwards. */
export default function WorldMapMobile(props: Props) {
  return <WorldMapDesktop {...props} />;
}
