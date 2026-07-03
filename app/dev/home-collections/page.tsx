'use client';

/**
 * Design sandbox: three treatments for the home collections row, rendered
 * against live data next to the shipped version. Not linked from the app.
 * The winner gets transplanted into components/home/CollectionsRow.tsx.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import CollectionsRow from '@/components/home/CollectionsRow';
import { COLLECTIONS, type Collection } from '@/lib/collections';
import { useRecipes } from '@/hooks/useRecipes';
import type { Recipe } from '@/lib/types';

/** Members of a collection; 'travels' is a lens on placed recipes. */
function membersOf(c: Collection, recipes: Recipe[]): Recipe[] {
  if (c.includes) return recipes.filter(c.includes);
  if (c.slug === 'travels') return recipes.filter((r) => r.country !== null);
  return [];
}

/* ── Variant A: per-collection accent tones ─────────────────────────── */

const ACCENT: Record<string, { bar: string; hover: string; edge: string }> = {
  'high-protein': { bar: 'bg-terracotta', hover: 'group-hover:text-terracotta', edge: 'hover:border-terracotta/40' },
  sides: { bar: 'bg-sage', hover: 'group-hover:text-sage', edge: 'hover:border-sage/50' },
  travels: { bar: 'bg-teal', hover: 'group-hover:text-teal', edge: 'hover:border-teal/50' },
  sunnah: { bar: 'bg-turmeric', hover: 'group-hover:text-turmeric', edge: 'hover:border-turmeric/60' },
};

function VariantA() {
  return (
    <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
      {COLLECTIONS.map((c) => {
        const a = ACCENT[c.slug];
        return (
          <li key={c.slug}>
            <Link
              href={c.href}
              className={`group relative block overflow-hidden rounded-2xl border border-brown-light/25 bg-surface p-5 pl-6 hover:shadow-md transition-[border-color,box-shadow] ${a.edge} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta`}
            >
              <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${a.bar}`} />
              <h3 className={`font-heading text-xl font-semibold text-brown-dark transition-colors leading-snug ${a.hover}`}>
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm text-brown-medium leading-relaxed">{c.description}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Variant B: food imagery from real members ──────────────────────── */

function VariantB({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
      {COLLECTIONS.map((c) => {
        const cover = membersOf(c, recipes).find((m) => m.image)?.image;
        return (
          <li key={c.slug}>
            <Link
              href={c.href}
              className="group flex items-stretch overflow-hidden rounded-2xl border border-brown-light/25 bg-surface hover:border-terracotta/40 hover:shadow-md transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <span className="relative w-28 sm:w-32 shrink-0 bg-parchment-dark">
                {cover ? (
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center p-3 text-center font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium/70">
                    Coming to the table
                  </span>
                )}
              </span>
              <span className="min-w-0 p-5">
                <h3 className="font-heading text-xl font-semibold text-brown-dark group-hover:text-terracotta transition-colors leading-snug">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-sm text-brown-medium leading-relaxed">{c.description}</p>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Variant C: cookbook chapter typography ─────────────────────────── */

const ROMAN = ['I', 'II', 'III', 'IV'];

function VariantC({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
      {COLLECTIONS.map((c, i) => {
        const members = membersOf(c, recipes);
        const countLine =
          c.slug === 'travels'
            ? 'Browse on the atlas'
            : members.length === 0
              ? 'First dishes on their way'
              : `${members.length} recipe${members.length === 1 ? '' : 's'}`;
        return (
          <li key={c.slug} className="border-t-2 border-brown-dark/70">
            <Link
              href={c.href}
              className="group block pt-3 pb-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="font-stamp text-[10px] uppercase tracking-[0.32em] text-brown-medium/80">
                  Chapter {ROMAN[i]}
                </span>
                <span className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium/70 nums-tabular">
                  {countLine}
                </span>
              </span>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-brown-dark group-hover:text-terracotta transition-colors leading-snug">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm text-brown-medium leading-relaxed">{c.description}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Variant D: chapter typography inside a clickable card (A + C) ──── */

function VariantD({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
      {COLLECTIONS.map((c, i) => {
        const a = ACCENT[c.slug];
        const members = membersOf(c, recipes);
        const countLine =
          c.slug === 'travels'
            ? 'Browse on the atlas'
            : members.length === 0
              ? 'First dishes on their way'
              : `${members.length} recipe${members.length === 1 ? '' : 's'}`;
        return (
          <li key={c.slug}>
            <Link
              href={c.href}
              className={`group relative block overflow-hidden rounded-2xl border border-brown-light/25 bg-surface p-5 pl-6 hover:shadow-md transition-[border-color,box-shadow] ${a.edge} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta`}
            >
              <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${a.bar}`} />
              <span className="flex items-baseline justify-between gap-4">
                <span className="font-stamp text-[10px] uppercase tracking-[0.32em] text-brown-medium/80">
                  Chapter {ROMAN[i]}
                </span>
                <span className="font-stamp text-[10px] uppercase tracking-[0.22em] text-brown-medium/70 nums-tabular">
                  {countLine}
                </span>
              </span>
              <h3 className={`mt-2 font-heading text-2xl font-semibold text-brown-dark transition-colors leading-snug ${a.hover}`}>
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm text-brown-medium leading-relaxed">{c.description}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

function PreviewBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-4 font-stamp text-xs uppercase tracking-[0.28em] text-brown-medium">{label}</div>
      {children}
    </section>
  );
}

export default function HomeCollectionsPreview() {
  const { data: recipes = [] } = useRecipes();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-14">
      <PreviewBlock label="Current · shipped">
        <CollectionsRow />
      </PreviewBlock>
      <PreviewBlock label="A · Accent tones">
        <VariantA />
      </PreviewBlock>
      <PreviewBlock label="B · Food imagery">
        <VariantB recipes={recipes} />
      </PreviewBlock>
      <PreviewBlock label="C · Cookbook chapter">
        <VariantC recipes={recipes} />
      </PreviewBlock>
      <PreviewBlock label="D · Chapter card (A + C)">
        <VariantD recipes={recipes} />
      </PreviewBlock>
    </div>
  );
}
