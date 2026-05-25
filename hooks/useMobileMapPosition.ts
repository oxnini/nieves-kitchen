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
  /**
   * Enable seamless east-west wrap. When true:
   *  - `handleMoveEnd` normalises lng back into [-180, 180] before saving state.
   *  - Horizontal snap-back is skipped (the caller is expected to render
   *    duplicated worlds at lng offsets ±360 so the seam is invisible).
   *  - `zoomTo` picks the shorter wrap direction when animating between
   *    far-apart longitudes.
   * Vertical clamp + snap-back is unaffected.
   */
  wrapLongitude?: boolean;
}

/** Bring a longitude into the canonical [-180, 180] range. */
function normaliseLng(lng: number): number {
  let out = lng;
  while (out > 180) out -= 360;
  while (out < -180) out += 360;
  return out;
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
  wrapLongitude = false,
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

    if (wrapLongitude) {
      // East-west wrap: skip horizontal snap-back (the duplicated worlds at
      // ±360 cover the seam) and just normalise lng into [-180, 180]. Y
      // still snaps back if the user pulled past the vertical extent.
      const [, svgY] = lngLatToSvg(coordinates[0], coordinates[1]);
      const halfH = projCy / z;
      const minY = worldExtent[0][1] + halfH;
      const maxY = worldExtent[1][1] - halfH;
      const fallbackY = (worldExtent[0][1] + worldExtent[1][1]) / 2;
      const clampedY = minY > maxY ? fallbackY : Math.max(minY, Math.min(maxY, svgY));
      const normLng = normaliseLng(coordinates[0]);

      if (Math.abs(clampedY - svgY) > 0.5) {
        const [, tlat] = svgToLngLat(0, clampedY);
        liveCenterRef.current = [normLng, coordinates[1]];
        liveZoomRef.current = z;
        zoomToImplRef.current({ coordinates: [normLng, tlat], zoom: z }, snapBackDuration);
        return;
      }

      const next: [number, number] = [normLng, coordinates[1]];
      liveCenterRef.current = next;
      liveZoomRef.current = z;
      setControlledPos({ coordinates: next, zoom: z });
      return;
    }

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
  }, [projCx, projCy, worldExtent, snapBackDuration, wrapLongitude]);

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

      // Wrap-aware lng delta: pick the shorter direction around the globe so
      // a fly-to from Tokyo to NYC doesn't traverse the whole Atlantic + Europe.
      let dLng = target.coordinates[0] - startCenter[0];
      if (wrapLongitude) {
        if (dLng > 180) dLng -= 360;
        else if (dLng < -180) dLng += 360;
      }
      const dLat = target.coordinates[1] - startCenter[1];
      const dZoom = target.zoom - startZoom;

      function tick(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const e = easeInOutCubic(t);
        let lng = startCenter[0] + dLng * e;
        if (wrapLongitude) lng = normaliseLng(lng);
        const pos: Position = {
          coordinates: [lng, startCenter[1] + dLat * e],
          zoom: startZoom + dZoom * e,
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
  }, [zoomAnimationDuration, wrapLongitude]);

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
