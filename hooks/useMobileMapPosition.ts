'use client';

import {
  useCallback, useEffect, useLayoutEffect, useRef, useReducer, useState,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import { startFlight, zoomToWidth, widthToZoom, type FlightHandle, type ViewTriple } from '@/lib/map/camera';

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

/** Settle window after a flight completes — ~2 frames at 60fps. Mirrors
 *  WorldMapDesktop: react-simple-maps v3 swallows onMoveEnd for prop-driven
 *  moves, so a timer closes the window; the onMoveEnd-consume branch only
 *  fires if a real gesture ends inside it. */
const SETTLE_TIMEOUT_MS = 34;

export function useMobileMapPosition({
  initialPosition,
  projection,
  zoomAnimationDuration = 550,
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
  /* Camera state — mirrors WorldMapDesktop:
     flightHandleRef  → the single camera authority; cancelled before any new flight
     isAnimatingRef   → true through the whole flight AND its settle window
     pendingSettleRef → a completed flight is waiting for its settle handshake
     settleTimerRef   → fallback timer that closes the settle window */
  const flightHandleRef = useRef<FlightHandle | null>(null);
  const isAnimatingRef = useRef(false);
  const pendingSettleRef = useRef(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  // Stable zoomTo via ref pattern — identity never changes
  const zoomToImplRef = useRef<(t: Position, d?: number) => void>(() => {});

  const finalizeSettle = useCallback(() => {
    if (settleTimerRef.current) { clearTimeout(settleTimerRef.current); settleTimerRef.current = null; }
    pendingSettleRef.current = false;
    isAnimatingRef.current = false;
  }, []);

  const handleMove = useCallback(({ zoom: z }: { x: number; y: number; zoom: number }) => {
    // A user gesture (drag/pinch) is the top camera authority: cancel any
    // programmatic flight and drop its settle window so the gesture's own
    // onMoveEnd is processed normally.
    if (isAnimatingRef.current || pendingSettleRef.current) {
      flightHandleRef.current?.cancel();
      flightHandleRef.current = null;
      if (settleTimerRef.current) { clearTimeout(settleTimerRef.current); settleTimerRef.current = null; }
      pendingSettleRef.current = false;
      isAnimatingRef.current = false;
    }
    liveZoomRef.current = Math.round(z * 100) / 100;
    const now = performance.now();
    if (now - throttleRef.current < 16) return; // ~60fps
    throttleRef.current = now;
    rerender();
  }, []);

  const handleMoveEnd = useCallback(({ coordinates, zoom: z }: { coordinates: [number, number]; zoom: number }) => {
    // Settle handshake: consume the first onMoveEnd after a flight completes —
    // sync to where the map actually is, skip snap-back (flights land on valid
    // targets), close the window.
    if (pendingSettleRef.current) {
      const next: [number, number] = [
        wrapLongitude ? normaliseLng(coordinates[0]) : coordinates[0],
        coordinates[1],
      ];
      liveCenterRef.current = next;
      liveZoomRef.current = z;
      setControlledPos({ coordinates: next, zoom: z });
      finalizeSettle();
      return;
    }
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
  }, [projCx, projCy, worldExtent, snapBackDuration, wrapLongitude, finalizeSettle]);

  useLayoutEffect(() => {
    /* Van Wijk & Nuij camera flight over projected view triples, mirroring
       WorldMapDesktop. `duration` is a max-duration hint; snap-back passes
       the shorter snapBackDuration. Reduced motion collapses the flight to
       one frame. On completion a settle window opens (isAnimatingRef stays
       true) so handleMoveEnd cannot mistake the final frame for a user move. */
    zoomToImplRef.current = function zoomTo(target: Position, duration: number = zoomAnimationDuration) {
      // One camera authority: cancel the previous flight and its settle window.
      flightHandleRef.current?.cancel();
      flightHandleRef.current = null;
      if (settleTimerRef.current) { clearTimeout(settleTimerRef.current); settleTimerRef.current = null; }
      pendingSettleRef.current = false;

      // Wrap-aware target lng: pick the shorter direction around the globe so
      // a fly-to from Tokyo to NYC doesn't traverse the whole Atlantic + Europe.
      // lngLatToSvg is linear in lng, so an unwrapped value projects correctly;
      // each frame normalises back into [-180, 180].
      let targetLng = target.coordinates[0];
      if (wrapLongitude) {
        let dLng = targetLng - liveCenterRef.current[0];
        if (dLng > 180) dLng -= 360;
        else if (dLng < -180) dLng += 360;
        targetLng = liveCenterRef.current[0] + dLng;
      }

      const [fromX, fromY] = lngLatToSvg(liveCenterRef.current[0], liveCenterRef.current[1]);
      const [toX, toY] = lngLatToSvg(targetLng, target.coordinates[1]);
      const from: ViewTriple = [fromX, fromY, zoomToWidth(liveZoomRef.current, viewBoxWidth)];
      const to: ViewTriple = [toX, toY, zoomToWidth(target.zoom, viewBoxWidth)];

      isAnimatingRef.current = true;

      flightHandleRef.current = startFlight(
        from,
        to,
        ([x, y, w]) => {
          let [lng, lat] = svgToLngLat(x, y);
          if (wrapLongitude) lng = normaliseLng(lng);
          liveCenterRef.current = [lng, lat];
          liveZoomRef.current = widthToZoom(w, viewBoxWidth);
          setControlledPos({ coordinates: liveCenterRef.current, zoom: liveZoomRef.current });
        },
        (_view, cancelled) => {
          flightHandleRef.current = null;
          // A cancelled flight yielded control (new flight or user gesture);
          // the canceller owns the flags. Completion opens the settle window.
          if (cancelled) return;
          pendingSettleRef.current = true;
          settleTimerRef.current = setTimeout(finalizeSettle, SETTLE_TIMEOUT_MS);
        },
        { maxDuration: duration, instant: !!reduceMotion },
      );
    };
  }, [zoomAnimationDuration, wrapLongitude, viewBoxWidth, reduceMotion, finalizeSettle]);

  const zoomTo = useCallback((target: Position, duration?: number) => {
    zoomToImplRef.current(target, duration);
  }, []);

  useEffect(() => {
    return () => {
      flightHandleRef.current?.cancel();
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
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
