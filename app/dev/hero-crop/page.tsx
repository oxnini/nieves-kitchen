'use client';

/**
 * Hero photo crop editor. Not linked from anywhere; navigate to
 * `/dev/hero-crop?src=<file in ~/Downloads>&slug=<recipe slug>`.
 *
 * Zoom and pan with the sliders (or drag the box on the full photo), and the
 * three previews show the crop exactly as the site will frame it: recipe card
 * and phone hero at 3:2, desktop hero at 4:3, both `object-cover`. Save as A /
 * Save as B write compare slots that ./compare shows on the real recipe page;
 * Use this one writes public/recipes/<slug>-hero.webp through ./api.
 */

import { useEffect, useMemo, useRef, useState } from 'react';

type Rect = { x: number; y: number; w: number; h: number };

const ASPECTS = [
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '1:1', value: 1 },
  { label: '4:5', value: 4 / 5 },
  { label: '3:4', value: 3 / 4 },
];

/** Where the site shows a hero, and at what shape. */
const FRAMES = [
  { label: 'Desktop recipe page (4:3)', aspect: 4 / 3, width: 480 },
  { label: 'Phone recipe page (3:2)', aspect: 3 / 2, width: 375 },
  { label: 'Recipe card (3:2)', aspect: 3 / 2, width: 320 },
];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** The centred `object-cover` window of `crop` inside a frame of `aspect`. */
function coverRect(crop: Rect, aspect: number): Rect {
  if (crop.w / crop.h > aspect) {
    const w = crop.h * aspect;
    return { x: crop.x + (crop.w - w) / 2, y: crop.y, w, h: crop.h };
  }
  const h = crop.w / aspect;
  return { x: crop.x, y: crop.y + (crop.h - h) / 2, w: crop.w, h };
}

/** Shows `rect` of a W×H source filling a box of the same aspect. */
function Window({ src, W, H, rect, width }: { src: string; W: number; H: number; rect: Rect; width: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-[3px] bg-parchment-dark"
      style={{ width, maxWidth: '100%', aspectRatio: `${rect.w} / ${rect.h}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="absolute"
        style={{
          maxWidth: 'none',
          width: `${(W / rect.w) * 100}%`,
          height: `${(H / rect.h) * 100}%`,
          left: `${(-rect.x / rect.w) * 100}%`,
          top: `${(-rect.y / rect.h) * 100}%`,
        }}
      />
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, disabled,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (n: number) => void; disabled?: boolean;
}) {
  return (
    <label className={`block ${disabled ? 'opacity-40' : ''}`}>
      <span className="flex justify-between text-sm text-brown-dark">
        <span>{label}</span>
        <span className="tabular-nums text-brown-medium">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-teal)]"
      />
    </label>
  );
}

export default function HeroCropPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [srcName, setSrcName] = useState('');
  const [slug, setSlug] = useState('');
  const [rot, setRot] = useState(0);
  const [dims, setDims] = useState<{ W: number; H: number } | null>(null);
  const [aspect, setAspect] = useState(4 / 3);
  const [zoom, setZoom] = useState(1);
  const [px, setPx] = useState(0.5);
  const [py, setPy] = useState(0.5);
  const [status, setStatus] = useState<{ variant: string; text: string } | null>(null);
  const overview = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; rect: Rect } | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setSrcName(q.get('src') ?? '');
    setSlug(q.get('slug') ?? '');
    fetch('/dev/hero-crop/api?list=1').then((r) => r.json()).then(setFiles);
  }, []);

  // A save message describes the crop it saved; any change makes it stale.
  useEffect(() => setStatus(null), [srcName, slug, rot, aspect, zoom, px, py]);

  const srcUrl = srcName ? `/dev/hero-crop/api?src=${encodeURIComponent(srcName)}&rot=${rot}` : '';

  const crop = useMemo<Rect | null>(() => {
    if (!dims) return null;
    const { W, H } = dims;
    const baseW = W / H > aspect ? H * aspect : W;
    const w = baseW / zoom;
    const h = w / aspect;
    return { x: (W - w) * px, y: (H - h) * py, w, h };
  }, [dims, aspect, zoom, px, py]);

  function reset() {
    setZoom(1);
    setPx(0.5);
    setPy(0.5);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!crop) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, rect: crop };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !dims || !overview.current) return;
    const scale = dims.W / overview.current.clientWidth;
    const { rect } = drag.current;
    const slackX = dims.W - rect.w;
    const slackY = dims.H - rect.h;
    if (slackX > 0) setPx(clamp((rect.x + (e.clientX - drag.current.x) * scale) / slackX, 0, 1));
    if (slackY > 0) setPy(clamp((rect.y + (e.clientY - drag.current.y) * scale) / slackY, 0, 1));
  }

  async function save(variant: '' | 'a' | 'b') {
    if (!crop || !slug) return;
    setStatus({ variant, text: 'Saving…' });
    const res = await fetch('/dev/hero-crop/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src: srcName, rot, slug, variant, ...crop }),
    });
    const out = await res.json();
    setStatus({
      variant,
      text: res.ok
        ? `Saved ${out.path} (${out.width}×${out.height}, ${Math.round(out.bytes / 1024)} KB)`
        : `Failed: ${out.error}`,
    });
  }

  const W = dims?.W ?? 1;
  const H = dims?.H ?? 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-brown-dark">
      <h1 className="font-heading text-3xl">Hero crop</h1>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="text-sm">Photo (from Downloads)</span>
          <select
            value={srcName}
            onChange={(e) => { setSrcName(e.target.value); setDims(null); reset(); }}
            className="mt-1 block max-w-xs rounded-md border border-line bg-surface px-2 py-1.5 text-base sm:text-sm"
          >
            {srcName && !files.includes(srcName) && <option value={srcName}>{srcName}</option>}
            {!srcName && <option value="">Pick a photo…</option>}
            {files.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Recipe slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-64 rounded-md border border-line bg-surface px-2 py-1.5 text-base sm:text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => { setRot((r) => (r + 90) % 360); setDims(null); reset(); }}
          className="rounded-md border border-line px-3 py-1.5 text-sm"
        >
          Rotate 90° ({rot}°)
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="mb-2 text-sm text-brown-medium">Full photo. Drag the box to move it.</p>
          {srcUrl && (
            <div
              ref={overview}
              className="relative select-none touch-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={() => { drag.current = null; }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={srcUrl}
                src={srcUrl}
                alt=""
                draggable={false}
                className="block w-full"
                onLoad={(e) => setDims({ W: e.currentTarget.naturalWidth, H: e.currentTarget.naturalHeight })}
              />
              {crop && (
                <div
                  className="absolute cursor-move border-2 border-white"
                  style={{
                    left: `${(crop.x / W) * 100}%`,
                    top: `${(crop.y / H) * 100}%`,
                    width: `${(crop.w / W) * 100}%`,
                    height: `${(crop.h / H) * 100}%`,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-sm">Crop shape</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {ASPECTS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setAspect(a.value)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    aspect === a.value ? 'border-teal bg-teal text-white' : 'border-line'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <Slider label="Zoom" value={zoom} min={1} max={3} step={0.01} onChange={setZoom} />
          <Slider
            label="Left ↔ Right"
            value={px}
            min={0}
            max={1}
            step={0.005}
            onChange={setPx}
            disabled={!!crop && dims!.W - crop.w < 1}
          />
          <Slider
            label="Up ↕ Down"
            value={py}
            min={0}
            max={1}
            step={0.005}
            onChange={setPy}
            disabled={!!crop && dims!.H - crop.h < 1}
          />
          <button type="button" onClick={reset} className="text-sm underline">Reset</button>
          {crop && (
            <p className="text-sm tabular-nums text-brown-medium">
              Crop: {Math.round(crop.w)}×{Math.round(crop.h)} at ({Math.round(crop.x)}, {Math.round(crop.y)})
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {(['a', 'b'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => save(v)}
                disabled={!crop || !slug}
                className="rounded-md border border-teal px-3 py-2 text-sm text-teal disabled:opacity-40"
              >
                Save as {v.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href={`/dev/hero-crop/compare?slug=${encodeURIComponent(slug)}`}
            target="_blank"
            rel="noreferrer"
            className="block text-sm text-teal underline"
          >
            Compare A and B on the recipe page
          </a>
          <button
            type="button"
            onClick={() => save('')}
            disabled={!crop || !slug}
            className="w-full rounded-md bg-teal px-4 py-2 text-white disabled:opacity-40"
          >
            Use this one ({slug || '…'}-hero.webp)
          </button>
          {status && (
            <p className="text-sm">
              {status.variant ? `${status.variant.toUpperCase()}: ` : ''}
              {status.text}
            </p>
          )}
          {status?.variant === '' && status.text.startsWith('Saved') && (
            <a href={`/recipes/${slug}`} target="_blank" rel="noreferrer" className="text-sm text-teal underline">
              Open the recipe page
            </a>
          )}
        </div>
      </div>

      {crop && dims && (
        <section className="mt-10">
          <h2 className="font-heading text-xl">How the site will show it</h2>
          <div className="mt-4 flex flex-wrap items-start gap-8">
            {FRAMES.map((f) => (
              <figure key={f.label}>
                <Window src={srcUrl} W={W} H={H} rect={coverRect(crop, f.aspect)} width={f.width} />
                <figcaption className="mt-2 text-sm text-brown-medium">{f.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
