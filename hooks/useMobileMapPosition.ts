'use client';

import {
  useCallback, useEffect, useLayoutEffect, useRef, useReducer, useState,
} from 'react';

export interface Position { coordinates: [number, number]; zoom: number }

interface ProjectionConfig {
  /** SVG width of the projected world */
  viewBoxWidth: number;
  /** SVG height of the projected world */
  viewBoxHeight: number;
  /** d3-zoom scale; usually viewBoxWidth / (2π) */
  projScale: number;
  /** World extent in SVG coords for snap-back */
  worldExtent: [[number, number], [number, number]];
}

interface Options {
  initialPosition: Position;
  projection: ProjectionConfig;
  /** Duration of programmatic fly-to animations in ms */
  zoomAnimationDuration?: number;
  /** Duration of overscroll snap-back in ms */
  snapBackDuration?: number;
}

interface Result {
  controlledPos: Position;
  liveZoomRef: React.MutableRefObject<number>;
  liveCenterRef: React.MutableRefObject<[number, number]>;
  /** Live zoom (rounded to 0.01). Updates on every animation frame during pan. */
  zoom: number;
  /** Live center (updated on moveEnd). */
  center: [number, number];
  /** d3-zoom move handler */
  handleMove: (e: { x: number; y: number; zoom: number }) => void;
  /** d3-zoom move-end handler */
  handleMoveEnd: (e: { coordinates: [number, number]; zoom: number }) => void;
  /** Stable identity. Animate to `target` over `duration` ms. */
  zoomTo: (target: Position, duration?: number) => void;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function useMobileMapPosition({
  initialPosition,
  projection,
  zoomAnimationDuration = 700,
  snapBackDuration = 320,
}: Options): Result {
  const RAD_PER_DEG = Math.PI / 180;
  const DEG_PER_RAD = 180 / Math.PI;
  const { viewBoxWidth, viewBoxHeight, projScale, worldExtent } = projection;
  const projCx = viewBoxWidth / 2;
  const projCy = viewBoxHeight / 2;

  function lngLatToSvg(lng: number, lat: number): [number, number] {
    return [
      projCx + projScale * lng * RAD_PER_DEG,
      projCy - projScale * Math.log(Math.tan(Math.PI / 4 + (lat * RAD_PER_DEG) / 2)),
    ];
  }
  function svgToLngLat(x: number, y: number): [number, number] {
    return [
      ((x - projCx) / projScale) * DEG_PER_RAD,
      (2 * Math.atan(Math.exp((projCy - y) / projScale)) - Math.PI / 2) * DEG_PER_RAD,
    ];
  }

  const [controlledPos, setControlledPos] = useState<Position>(initialPosition);
  const liveCenterRef = useRef<[number, number]>(initialPosition.coordinates);
  const liveZoomRef = useRef<number>(initialPosition.zoom);
  const [, rerender] = useReducer((x: number) => x + 1, 0);
  const throttleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  // Stable zoomTo via ref pattern — identity never changes
  const zoomToImplRef = useRef<(t: Position, d?: number) => void>(() => {});

  const handleMove = useCallback(({ zoom: z }: { x: number; y: number; zoom: number }) => {
    if (isAnimatingRef.current && animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
      isAnimatingRef.current = false;
    }
    liveZoomRef.current = Math.round(z * 100) / 100;
    const now = performance.now();
    if (now - throttleRef.current < 16) return; // ~60fps
    throttleRef.current = now;
    rerender();
  }, []);

  const handleMoveEnd = useCallback(({ coordinates, zoom: z }: { coordinates: [number, number]; zoom: number }) => {
    if (isAnimatingRef.current) return;

    const [svgX, svgY] = lngLatToSvg(coordinates[0], coordinates[1]);
    const halfW = projCx / z;
    const halfH = projCy / z;
    const minX = worldExtent[0][0] + halfW;
    const maxX = worldExtent[1][0] - halfW;
    const minY = worldExtent[0][1] + halfH;
    const maxY = worldExtent[1][1] - halfH;
    const fallbackX = (worldExtent[0][0] + worldExtent[1][0]) / 2;
    const fallbackY = (worldExtent[0][1] + worldExtent[1][1]) / 2;
    const clampedX = minX > maxX ? fallbackX : Math.max(minX, Math.min(maxX, svgX));
    const clampedY = minY > maxY ? fallbackY : Math.max(minY, Math.min(maxY, svgY));

    if (Math.abs(clampedX - svgX) > 0.5 || Math.abs(clampedY - svgY) > 0.5) {
      const [tlng, tlat] = svgToLngLat(clampedX, clampedY);
      liveCenterRef.current = coordinates;
      liveZoomRef.current = z;
      zoomToImplRef.current({ coordinates: [tlng, tlat], zoom: z }, snapBackDuration);
      return;
    }

    liveCenterRef.current = coordinates;
    liveZoomRef.current = z;
    setControlledPos({ coordinates, zoom: z });
  }, [projCx, projCy, worldExtent, snapBackDuration]);

  useLayoutEffect(() => {
    zoomToImplRef.current = function zoomTo(target: Position, duration: number = zoomAnimationDuration) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      const startCenter: [number, number] = [...liveCenterRef.current];
      const startZoom = liveZoomRef.current;
      const startTime = performance.now();
      isAnimatingRef.current = true;

      function tick(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const e = easeInOutCubic(t);
        const pos: Position = {
          coordinates: [
            startCenter[0] + (target.coordinates[0] - startCenter[0]) * e,
            startCenter[1] + (target.coordinates[1] - startCenter[1]) * e,
          ],
          zoom: startZoom + (target.zoom - startZoom) * e,
        };
        liveCenterRef.current = pos.coordinates;
        liveZoomRef.current = pos.zoom;
        setControlledPos(pos);
        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(tick);
        } else {
          animFrameRef.current = null;
          isAnimatingRef.current = false;
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
  }, [zoomAnimationDuration]);

  const zoomTo = useCallback((target: Position, duration?: number) => {
    zoomToImplRef.current(target, duration);
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return {
    controlledPos,
    liveZoomRef,
    liveCenterRef,
    zoom: liveZoomRef.current,
    center: liveCenterRef.current,
    handleMove,
    handleMoveEnd,
    zoomTo,
  };
}
