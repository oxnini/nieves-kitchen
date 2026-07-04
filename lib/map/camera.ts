import 'client-only';
import { interpolateZoom } from 'd3-interpolate';

/** A camera view in projected coordinates: center x, y and visible width w.
 *  Callers convert their own notion of zoom via zoomToWidth/widthToZoom so
 *  this module stays projection- and framework-agnostic. */
export type ViewTriple = [x: number, y: number, w: number];

export interface FlightOptions {
  /** Perceptual speed multiplier over d3's recommended duration. */
  speed?: number;
  /** Duration clamps, ms. */
  minDuration?: number;
  maxDuration?: number;
  /** Reduced motion: complete on the first frame. */
  instant?: boolean;
}

export interface FlightHandle {
  /** Stop where the flight is now. onDone(lastView, cancelled=true) fires once. */
  cancel(): void;
}

/** Van Wijk & Nuij smooth zoom-and-pan (the Mapbox flyTo path): long moves
 *  arc out then back in, short moves ease directly. t is perceptually
 *  uniform, so we advance it linearly. */
export function startFlight(
  from: ViewTriple,
  to: ViewTriple,
  onFrame: (view: ViewTriple) => void,
  onDone: (view: ViewTriple, cancelled: boolean) => void,
  opts: FlightOptions = {},
): FlightHandle {
  const { speed = 1.4, minDuration = 250, maxDuration = 1100, instant = false } = opts;

  const path = interpolateZoom(from, to);
  const duration = instant
    ? 0
    : Math.max(minDuration, Math.min(maxDuration, path.duration / speed));

  let raf: number | null = null;
  let settled = false;
  let lastView: ViewTriple = from;
  const start = performance.now();

  const finish = (view: ViewTriple, cancelled: boolean) => {
    if (settled) return;
    settled = true;
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
    onDone(view, cancelled);
  };

  const tick = (now: number) => {
    const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
    const view: ViewTriple = t >= 1 ? to : (path(t) as ViewTriple);
    lastView = view;
    onFrame(view);
    if (t >= 1) {
      finish(view, false);
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return {
    cancel() {
      finish(lastView, true);
    },
  };
}

export function zoomToWidth(zoom: number, refWidth: number): number {
  return refWidth / zoom;
}

export function widthToZoom(w: number, refWidth: number): number {
  return refWidth / w;
}
