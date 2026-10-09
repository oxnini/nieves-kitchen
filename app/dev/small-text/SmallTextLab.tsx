'use client';

import Link from 'next/link';
import { setTheme, useIsSepia } from '@/hooks/useTheme';
import { useState, type ReactNode } from 'react';
import { Choice, Group, Slider } from '../hero-viewport/controls';

/**
 * The colophons that close /about and /promise, four ways. "Before" is main
 * before F6 (Cutive Mono in brown-light, 2.5:1 by day). "Ink only" is what the
 * F6 branch ships: the same type in brown-medium. "Hanken" and "Newsreader"
 * also change the face, written in sentence case. The size slider applies to
 * the variant shown on the left; the comparison column uses each variant's
 * default size.
 */

type Variant = 'before' | 'ink' | 'hanken' | 'serif';

const VARIANTS: [Variant, string][] = [
  ['before', 'Before'],
  ['ink', 'A · Ink only (shipped)'],
  ['hanken', 'B · Hanken'],
  ['serif', 'C · Newsreader italic'],
];

const HINT: Record<Variant, string> = {
  before: 'Main before F6. Cutive Mono capitals (.font-stamp uppercases), brown-light: 2.5:1 by day, 3.2:1 at night.',
  ink: 'What the F6 branch ships. Same Cutive Mono capitals, ink lifted to brown-medium: 5.9:1 by day, 7.2:1 at night.',
  hanken: 'Hanken in brown-medium, sentence case, no tracking. Reads like the rest of the small text now.',
  serif: 'Newsreader italic in brown-medium, sentence case. A signed-off feel, like the lede.',
};

const DEFAULT_SIZE: Record<Variant, number> = { before: 14, ink: 14, hanken: 14, serif: 16 };

function style(v: Variant, size: number) {
  const base = { fontSize: `${size}px` };
  switch (v) {
    case 'before': return { cls: 'font-stamp tracking-[0.15em] text-brown-light', base };
    case 'ink': return { cls: 'font-stamp tracking-[0.15em] text-brown-medium', base };
    case 'hanken': return { cls: 'font-body text-brown-medium', base };
    case 'serif': return { cls: 'font-heading italic text-brown-medium', base };
  }
}

function Colophons({ v, size }: { v: Variant; size: number }) {
  const { cls, base } = style(v, size);
  const title = v === 'before' || v === 'ink';
  const linkHover = v === 'before' ? 'hover:text-brown-medium' : 'hover:text-brown-dark';
  return (
    <div className="space-y-10">
      <Sample label="/about">
        <p className={cls} style={base}>
          <Link href="/promise" className={`underline decoration-brown-light/40 underline-offset-2 ${linkHover} transition-colors`}>
            {title ? '100% Halal' : '100% halal'}
          </Link>{' '}
          &middot; {title ? 'Globally Inspired · Macro-Friendly · Tried & Tested' : 'Globally inspired · Macro-friendly · Tried and tested'}
        </p>
      </Sample>
      <Sample label="/promise">
        <p className={cls} style={base}>
          {title ? 'Cooked, Checked & Kept Halal · One Kitchen at a Time' : 'Cooked, checked and kept halal · One kitchen at a time'}
        </p>
      </Sample>
    </div>
  );
}

function Sample({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[13px] text-brown-medium mb-3">{label}</p>
      <footer className="pt-8 border-t border-brown-light/30">{children}</footer>
    </div>
  );
}

export default function SmallTextLab() {
  const sepia = useIsSepia();
  const [v, setV] = useState<Variant>('ink');
  const [size, setSize] = useState(DEFAULT_SIZE.ink);
  const [frame, setFrame] = useState<'laptop' | 'phone'>('laptop');

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid gap-10 lg:grid-cols-[320px_1fr]">
      <aside className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-[32px] leading-tight text-brown-dark">Colophons</h1>
          <p className="mt-2 text-[14px] text-brown-medium leading-relaxed">
            Audit F6. Every functional label moved to Hanken; these two sign-off lines are a
            taste call, so production only lifted their ink. Pick a face.
          </p>
        </div>
        <Group title="Variant">
          <Choice label="Face" value={v} options={VARIANTS} hint={HINT[v]}
            onChange={(n) => { setV(n); setSize(DEFAULT_SIZE[n]); }} />
          <Slider label="Size" value={size} min={12} max={18} unit="px" onChange={setSize}
            hint="Live site: 12px on phones, 14px from sm up." />
        </Group>
        <Group title="View">
          <Choice label="Theme" value={sepia ? 'sepia' : 'parchment'}
            options={[['parchment', 'Day'], ['sepia', 'Night']]}
            onChange={(t) => setTheme(t as 'parchment' | 'sepia')} />
          <Choice label="Width" value={frame} options={[['laptop', 'Laptop'], ['phone', 'Phone (390)']]} onChange={setFrame} />
        </Group>
      </aside>

      <main className="min-w-0 flex flex-col gap-14">
        <section className={frame === 'phone' ? 'w-[390px] max-w-full px-6 py-8 ring-1 ring-line' : ''}>
          <Colophons v={v} size={size} />
        </section>

        <section>
          <h2 className="font-heading text-[24px] text-brown-dark mb-6">All four</h2>
          <div className="grid gap-12 sm:grid-cols-2">
            {VARIANTS.map(([id, name]) => (
              <div key={id}>
                <p className="text-[14px] font-semibold text-brown-dark mb-4">{name}</p>
                <Colophons v={id} size={DEFAULT_SIZE[id]} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
