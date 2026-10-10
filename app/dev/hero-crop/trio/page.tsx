'use client';

/**
 * Three hero candidates side by side, each on the real site surfaces: the
 * recipe card in the /recipes grid, the desktop recipe page, and the phone
 * recipe page. Reads the A/B/C compare slots
 * (public/recipes/<slug>-hero-<a|b|c>.webp, never committed).
 * Navigate to `/dev/hero-crop/trio?slug=<slug>`, optionally with
 * `&a=<label>&b=<label>&c=<label>` to caption the columns.
 */

import { useEffect, useRef, useState } from 'react';
import RecipeCard from '@/components/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';

const VARIANTS = ['a', 'b', 'c'] as const;
const DESKTOP = { w: 1280, h: 1000 };
const PHONE = { w: 390, h: 844 };

/** The real recipe page in a desktop-width frame, scaled down to fit its column. */
function DesktopFrame({ src }: { src: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / DESKTOP.w));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="relative overflow-hidden rounded-md border border-line" style={{ height: DESKTOP.h * scale }}>
      <iframe
        src={src}
        title="Desktop recipe page"
        className="absolute left-0 top-0 origin-top-left border-0"
        style={{ width: DESKTOP.w, height: DESKTOP.h, transform: `scale(${scale})` }}
      />
    </div>
  );
}

/** One surface, the three candidates across. Hoisted so iframes never remount on re-render. */
function Row({
  title,
  labels,
  children,
}: {
  title: string;
  labels: Record<string, string>;
  children: (v: string) => React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-heading text-xl text-brown-dark">{title}</h2>
      <div className="mt-4 grid grid-cols-3 gap-7">
        {VARIANTS.map((v) => (
          <div key={v}>
            <p className="mb-2 text-sm text-brown-dark">
              <span className="font-semibold">{v.toUpperCase()}</span>
              {labels[v] && <span className="text-brown-medium"> · {labels[v]}</span>}
            </p>
            {children(v)}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HeroTrioPage() {
  const { data: recipes } = useRecipes();
  const [slug, setSlug] = useState('');
  const [labels, setLabels] = useState<Record<string, string>>({});
  // Busts the dev image optimizer's cache, as in ../compare.
  const [version] = useState(() => Date.now());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get('slug') ?? '');
    setLabels(Object.fromEntries(VARIANTS.map((v) => [v, params.get(v) ?? ''])));
  }, []);

  const recipe = recipes?.find((r) => r.id === slug);
  if (!recipe) {
    return <p className="p-8 text-center text-brown-medium">{recipes ? `No recipe "${slug}"` : 'Loading…'}</p>;
  }

  const image = (v: string) => `/recipes/${slug}-hero-${v}.webp?v=${version}`;
  const page = (v: string) => `/dev/hero-crop/compare?slug=${slug}&v=${v}&bare=1`;

  return (
    <div className="mx-auto max-w-6xl px-8 pb-20 pt-7">
      <h1 className="font-heading text-3xl text-brown-dark">{recipe.name}: hero candidates</h1>

      <Row title="Recipe card, /recipes grid" labels={labels}>
        {(v) => <RecipeCard recipe={{ ...recipe, image: image(v) }} />}
      </Row>

      <Row title="Recipe page, desktop (1280px, scaled)" labels={labels}>{(v) => <DesktopFrame src={page(v)} />}</Row>

      <Row title="Recipe page, phone (390px)" labels={labels}>
        {(v) => (
          <iframe
            src={page(v)}
            title="Phone recipe page"
            className="rounded-md border border-line"
            style={{ width: PHONE.w, maxWidth: '100%', height: PHONE.h }}
          />
        )}
      </Row>
    </div>
  );
}
