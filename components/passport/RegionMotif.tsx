'use client';

import { useMemo } from 'react';
import { geoEqualEarth, geoPath } from 'd3-geo';
import type { CulinaryRegion } from '@/lib/types';
import { useMapTopology } from '@/hooks/useMapTopology';

interface Props {
  region: CulinaryRegion;
}

const VIEW_W = 400;
const VIEW_H = 280;
const PADDING = 14;

export default function RegionMotif({ region }: Props) {
  const { regionOutlines, isLoading } = useMapTopology();

  const path = useMemo(() => {
    if (isLoading) return null;
    const outline = regionOutlines.find(o => o.key === region);
    if (!outline) return null;
    const projection = geoEqualEarth().fitExtent(
      [[PADDING, PADDING], [VIEW_W - PADDING, VIEW_H - PADDING]],
      outline.geometry,
    );
    return geoPath(projection)(outline.geometry);
  }, [isLoading, regionOutlines, region]);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      {path && (
        <path
          d={path}
          fill="var(--color-brown-medium)"
          fillOpacity={0.06}
          stroke="var(--color-brown-medium)"
          strokeOpacity={0.22}
          strokeWidth={0.75}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
