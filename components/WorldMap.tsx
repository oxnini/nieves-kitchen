'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import WorldMapDesktop from './WorldMapDesktop';
import WorldMapMobile from './WorldMapMobile';
import type { Recipe } from '@/lib/types';

interface Props {
  recipes: Recipe[];
  isLoading?: boolean;
  flyTo?: { lng: number; lat: number; zoom?: number };
}

export default function WorldMap(props: Props) {
  const isMobile = useIsMobile();
  return isMobile ? <WorldMapMobile {...props} /> : <WorldMapDesktop {...props} />;
}
