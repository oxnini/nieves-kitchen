'use client';

/**
 * Visual harness for the recipe-detail extra-images gallery.
 *
 * Not linked from anywhere; navigate to `/dev/recipe-gallery`.
 *
 * Compares three layouts: Hybrid (1 extra -> margin, 2+ -> band), Unified (one
 * fixed block below the spread), and the raw Margin / Band components forced.
 * Every extra is clickable to expand in a lightbox. A read/cook toggle confirms
 * the gallery is hidden in cook mode. Shown in BOTH the full-page width and the
 * modal width, since RecipeDetail renders in both contexts.
 */

import { useState } from 'react';
import Image from 'next/image';
import { Heart, Copy, ChefHat, BookOpen } from 'lucide-react';
import {
  MarginGallery,
  BandGallery,
  UnifiedGallery,
  type DevRecipeImage,
} from './RecipeImageGallery';
import { Lightbox } from './Lightbox';

// ── Stand-in images (dev preview only; never seeded) ──
const PORTRAIT: DevRecipeImage = {
  url: '/recipes/dumpling-lasagna-hero.webp',
  width: 1086,
  height: 1448,
  caption: 'Steamed in its own broth',
};
const LANDSCAPE: DevRecipeImage = {
  url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1600&h=1067&fit=crop&q=80',
  width: 1600,
  height: 1067,
  caption: 'Layered like a lasagna',
};
const SQUARE: DevRecipeImage = {
  url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1100&h=1100&fit=crop&q=80',
  width: 1100,
  height: 1100,
  caption: 'Ready to serve',
};

type Aspect = 'portrait' | 'landscape';
type Layout = 'hybrid' | 'unified' | 'margin' | 'band';
type Resolved = 'margin' | 'band' | 'unified';
type Mode = 'read' | 'cook';

function extrasFor(count: number, aspect: Aspect): DevRecipeImage[] {
  // count = total images including the hero, so extras = count - 1.
  switch (count) {
    case 1:
      return [];
    case 2:
      return [aspect === 'portrait' ? PORTRAIT : LANDSCAPE];
    case 3:
      return [PORTRAIT, LANDSCAPE];
    default:
      return [PORTRAIT, LANDSCAPE, SQUARE];
  }
}

/** Hybrid rule: 1 extra -> margin, 2+ -> band. Other layouts pass through. */
function resolveLayout(layout: Layout, extraCount: number): Resolved {
  if (layout === 'hybrid') return extraCount <= 1 ? 'margin' : 'band';
  return layout;
}

export default function RecipeGalleryDevPage() {
  const [layout, setLayout] = useState<Layout>('hybrid');
  const [count, setCount] = useState(2);
  const [aspect, setAspect] = useState<Aspect>('portrait');
  const [mode, setMode] = useState<Mode>('read');
  const [expanded, setExpanded] = useState<DevRecipeImage | null>(null);

  const extras = extrasFor(count, aspect);
  const resolved = resolveLayout(layout, extras.length);

  return (
    <div className="min-h-screen bg-parchment text-brown-dark">
      <header className="sticky top-0 z-40 border-b border-brown-light/20 bg-parchment/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div>
            <p className="font-stamp text-[10px] uppercase tracking-[0.32em] text-brown-medium">
              DEV · RECIPE EXTRA IMAGES
            </p>
            <h1 className="font-heading text-lg font-semibold">Multi-image gallery — A/B preview</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Switch
              label="Layout"
              value={layout}
              onChange={(v) => setLayout(v as Layout)}
              options={[
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'unified', label: 'Unified' },
                { value: 'margin', label: 'Margin' },
                { value: 'band', label: 'Band' },
              ]}
            />
            <Switch
              label="Images"
              value={String(count)}
              onChange={(v) => setCount(Number(v))}
              options={[1, 2, 3, 4].map((n) => ({ value: String(n), label: String(n) }))}
            />
            <Switch
              label="Single aspect"
              value={aspect}
              onChange={(v) => setAspect(v as Aspect)}
              options={[
                { value: 'portrait', label: 'Portrait' },
                { value: 'landscape', label: 'Landscape' },
              ]}
              disabled={count !== 2}
            />
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'cook' ? 'read' : 'cook'))}
              className="inline-flex items-center gap-2 rounded-full border border-brown-light/25 bg-surface px-4 py-2 text-sm font-medium text-brown-dark transition-colors hover:bg-parchment-dark"
            >
              {mode === 'cook' ? (
                <>
                  <BookOpen size={15} className="text-brown-medium" /> Read mode
                </>
              ) : (
                <>
                  <ChefHat size={15} className="text-terracotta" /> Cook mode
                </>
              )}
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-6 pb-2">
          <p className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium/80">
            {mode === 'cook'
              ? 'Cook mode · gallery hidden'
              : `Read mode · ${layout} -> renders: ${resolved}${extras.length === 0 ? ' (no extras, nothing shows)' : ''} · click a photo to expand`}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-8">
        <ContextPanel label="Full page · max-w-5xl">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <Spread resolved={resolved} extras={extras} mode={mode} onOpen={setExpanded} />
          </div>
        </ContextPanel>

        <ContextPanel label="Modal · max-w-[880px]">
          <div className="mx-auto w-full max-w-[880px] rounded-2xl border border-brown-light/20 bg-parchment shadow-2xl">
            <div className="scrollbar-quiet max-h-[80vh] overflow-y-auto px-4 py-6 sm:px-6">
              <Spread resolved={resolved} extras={extras} mode={mode} onOpen={setExpanded} />
            </div>
          </div>
        </ContextPanel>
      </div>

      <Lightbox img={expanded} onClose={() => setExpanded(null)} />
    </div>
  );
}

/**
 * A faithful-enough copy of the RecipeDetail read-mode spread: the exact hero,
 * a short Ingredients column and a tall Instructions column, so the margin
 * variant's white-space fill is visible. In cook mode the gallery is omitted
 * entirely, mirroring the integration rule.
 */
function Spread({
  resolved,
  extras,
  mode,
  onOpen,
}: {
  resolved: Resolved;
  extras: DevRecipeImage[];
  mode: Mode;
  onOpen: (img: DevRecipeImage) => void;
}) {
  const isCook = mode === 'cook';
  const hasExtras = !isCook && extras.length > 0;
  const showMargin = hasExtras && resolved === 'margin';
  const showBand = hasExtras && resolved === 'band';
  const showUnified = hasExtras && resolved === 'unified';

  return (
    <div>
      {/* Hero — copied from RecipeDetail, left exactly as-is. Uses the real
          dumpling-lasagna hero photo, same as the live recipe page. */}
      <div className="relative h-[320px] overflow-hidden rounded-2xl">
        <Image
          src="/recipes/dumpling-lasagna-hero.webp"
          alt="Dumpling Lasagna"
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1210]/60 via-[#1A1210]/10 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm text-white/80">China</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">Dumpling Lasagna</h1>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#1A1210]/30 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <Copy size={16} /> Copy Recipe
            </span>
            <span className="rounded-full bg-[#1A1210]/30 p-2 backdrop-blur-sm">
              <Heart size={20} className="text-white/90" />
            </span>
          </div>
        </div>
      </div>

      {/* Editorial intro (read mode only, like the real page) */}
      {!isCook && (
        <>
          <p className="mt-6 font-heading text-xl italic leading-relaxed text-brown-dark/90">
            &ldquo;All the soul of a plate of jiaozi, layered up like a lasagna and steamed in its own
            broth.&rdquo;
          </p>
          <p className="mt-4 text-base leading-relaxed text-brown-dark">
            Seasoned beef and Napa cabbage get layered between shop-bought dumpling wrappers like a
            tiny lasagna, then steamed in a pour of stock until the wrappers turn silky.
          </p>
        </>
      )}

      {/* Spread */}
      <div className="mt-8 flex flex-col gap-8 md:flex-row lg:gap-12">
        {/* Left: Ingredients (short) */}
        <section className="w-full md:w-[340px] md:shrink-0">
          <h2 className="mb-3 font-heading text-2xl font-semibold text-brown-dark">Ingredients</h2>
          <ul className="space-y-2 text-sm text-brown-dark">
            {['400g beef mince', '1 tbsp light soy sauce', '1 tbsp grated ginger', '3 garlic cloves', '10 dumpling wrappers', '300g Napa cabbage', '150ml stock', '1 tbsp chili oil'].map(
              (line) => (
                <li key={line} className="border-b border-brown-light/15 pb-2">
                  {line}
                </li>
              ),
            )}
          </ul>

          {showMargin && <MarginGallery images={extras} onOpen={onOpen} />}
        </section>

        {/* Right: Instructions (tall — drives the white space on the left) */}
        <section className="min-w-0 flex-1">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-brown-dark">Instructions</h2>
          <ol className="space-y-5 text-base leading-relaxed text-brown-dark">
            {[
              'Combine the mince with soy, sesame oil, ginger, garlic, spring onions, coriander and white pepper. Mix in one direction until sticky so the layers hold together rather than crumbling apart.',
              'Shred the Napa cabbage fine. Fold it through the meat or keep it separate to layer as you build; it melts into the meat as it steams either way.',
              'Spread a layer of seasoned meat in a heatproof bowl, then cabbage, then a dumpling wrapper laid flat like a pasta sheet. Repeat about three times and finish with a wrapper on top.',
              'Pour stock gently down the side until it comes at least halfway up. The meat releases more liquid as it cooks, and the broth is half the joy of this dish.',
              'Steam over a steady boil for 12 to 15 minutes until the meat is cooked through and the wrappers are tender and translucent. Do not steam much longer or the meat toughens.',
              'Lift the bowl out carefully, scatter over coriander and spring onion, and spoon over chili oil, soy and sesame. Serve straight from the bowl while steaming hot.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-stamp text-sm text-terracotta">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {showBand && (
        <div className="mt-10">
          <BandGallery images={extras} onOpen={onOpen} />
        </div>
      )}
      {showUnified && (
        <div className="mt-10">
          <UnifiedGallery images={extras} onOpen={onOpen} />
        </div>
      )}
    </div>
  );
}

function ContextPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brown-light/20 bg-surface-alt">
      <div className="border-b border-brown-light/20 bg-parchment-dark/50 px-4 py-2">
        <p className="font-stamp text-[10px] uppercase tracking-[0.28em] text-brown-medium">{label}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Switch({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${disabled ? 'opacity-40' : ''}`}>
      <span className="mr-1 text-xs font-medium text-brown-medium">{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(o.value)}
          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
            value === o.value
              ? 'border-terracotta bg-terracotta text-white'
              : 'border-brown-light/25 bg-surface text-brown-medium hover:bg-parchment-dark'
          } ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
