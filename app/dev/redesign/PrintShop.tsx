'use client';

import Image from 'next/image';
import { Fraunces } from 'next/font/google';
import { SAMPLE_COLLECTIONS, SAMPLE_RECIPES } from './data';

/**
 * Direction B — "The Print Shop".
 *
 * Full-bleed colour-block sections like turning cookbook pages, Fraunces
 * display type, checkerboard strips, postcard recipe cards with airmail
 * edges, monospace labels promoted to a first-class voice.
 *
 * All styling is scoped here; nothing touches global tokens.
 */

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  style: ['normal', 'italic'],
});

const C = {
  turmeric: '#F2C14E',
  tomato: '#E8472B',
  sea: '#0F4E77',
  pink: '#F6B8C1',
  cream: '#FAF3E3',
  olive: '#6F6C43',
  ink: '#221A12',
};

/** Classic airmail envelope stripe. */
function AirmailStripe({ height = 10 }: { height?: number }) {
  return (
    <div
      aria-hidden
      style={{
        height,
        background: `repeating-linear-gradient(-45deg, ${C.tomato} 0 12px, ${C.cream} 12px 24px, ${C.sea} 24px 36px, ${C.cream} 36px 48px)`,
      }}
    />
  );
}

function Checkerboard({ height = 22, color = C.tomato }: { height?: number; color?: string }) {
  return (
    <div
      aria-hidden
      style={{
        height,
        background: `repeating-conic-gradient(${color} 0% 25%, ${C.cream} 0% 50%) 0 0 / ${height * 2}px ${height * 2}px`,
      }}
    />
  );
}

function MonoLabel({ children, color = C.ink }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-stamp text-[11px] uppercase tracking-[0.2em]" style={{ color }}>
      {children}
    </p>
  );
}

export default function PrintShop() {
  return (
    <div className={fraunces.className} style={{ backgroundColor: C.cream, color: C.ink }}>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header style={{ backgroundColor: C.cream }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-2xl font-black tracking-tight" style={{ color: C.tomato }}>
            nieves kitchen<span style={{ color: C.sea }}>*</span>
          </span>
          <nav className="hidden gap-7 sm:flex">
            {['table', 'atlas', 'recipes', 'pantry'].map((l) => (
              <span
                key={l}
                className="cursor-pointer font-stamp text-[12px] uppercase tracking-[0.18em] underline-offset-4 transition-colors hover:underline"
                style={{ color: l === 'table' ? C.tomato : C.ink }}
              >
                {l}
              </span>
            ))}
          </nav>
        </div>
        <Checkerboard height={14} />
      </header>

      {/* ── Hero: turmeric page ────────────────────────────── */}
      <section style={{ backgroundColor: C.turmeric }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-[1.15fr_1fr] md:py-20">
          <div className="space-y-6">
            <MonoLabel>A world cookbook, printed daily</MonoLabel>
            <h1 className="text-5xl leading-[0.98] font-black md:text-[4.2rem]" style={{ color: C.tomato }}>
              Cook the{' '}
              <em className="italic" style={{ color: C.sea }}>
                world
              </em>{' '}
              in colour.
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed font-medium" style={{ color: C.ink }}>
              Loud flavours, honest recipes, and a passport that fills up as you cook. Pick a
              country, make it tonight, send yourself the postcard.
            </p>
            <div className="flex items-center gap-5 pt-2">
              <span
                className="cursor-pointer px-7 py-3.5 font-stamp text-[13px] font-bold uppercase tracking-[0.14em] transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: C.tomato,
                  color: C.cream,
                  boxShadow: `5px 5px 0 ${C.sea}`,
                }}
              >
                Start cooking
              </span>
              <span
                className="cursor-pointer font-stamp text-[12px] uppercase tracking-[0.18em] underline underline-offset-4"
                style={{ color: C.sea }}
              >
                Browse the shelf
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden
              className="absolute -right-4 -bottom-4 h-full w-full rounded-t-full"
              style={{ backgroundColor: C.sea }}
            />
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
              <Image
                src="/recipes/xinjiang-lamb-dumplings-hero.webp"
                alt="Xinjiang lamb dumplings"
                fill
                sizes="(max-width: 768px) 90vw, 384px"
                className="object-cover"
                priority
              />
            </div>
            <div
              className="absolute -top-5 -left-5 flex h-24 w-24 rotate-[-12deg] items-center justify-center rounded-full text-center font-stamp text-[10px] leading-tight font-bold uppercase tracking-[0.08em]"
              style={{ backgroundColor: C.pink, color: C.ink, border: `2px solid ${C.ink}` }}
            >
              New
              <br />
              this
              <br />
              week
            </div>
          </div>
        </div>
      </section>

      <Checkerboard height={22} color={C.sea} />

      {/* ── Collections as colour-block pages ──────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-4xl font-black" style={{ color: C.ink }}>
            Pick a shelf<span style={{ color: C.tomato }}>.</span>
          </h2>
          <MonoLabel color={C.olive}>04 collections</MonoLabel>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_COLLECTIONS.map((col, i) => {
            const papers = [C.sea, C.tomato, C.pink, C.olive];
            const inks = [C.cream, C.cream, C.ink, C.cream];
            return (
              <div
                key={col.slug}
                className="group cursor-pointer p-6 transition-transform hover:rotate-[-1.2deg] hover:-translate-y-1"
                style={{ backgroundColor: papers[i], color: inks[i] }}
              >
                <p className="font-stamp text-[11px] uppercase tracking-[0.2em] opacity-80">
                  Shelf {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-8 text-[1.35rem] leading-tight font-bold">{col.title}</h3>
                <p className="mt-4 font-stamp text-[11px] uppercase tracking-[0.2em] opacity-80">
                  {col.count} recipes →
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Recipe cards as postcards ──────────────────────── */}
      <section style={{ backgroundColor: C.pink }}>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-4xl font-black" style={{ color: C.ink }}>
              Fresh off the press
            </h2>
            <MonoLabel>Airmail, no stamps required yet</MonoLabel>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {SAMPLE_RECIPES.map((r, i) => (
              <div
                key={r.slug}
                className="cursor-pointer bg-white shadow-[0_10px_30px_rgba(34,26,18,0.15)] transition-transform hover:-translate-y-1"
                style={{ rotate: `${[-1.2, 0.8, -0.6][i]}deg`, backgroundColor: C.cream }}
              >
                <AirmailStripe />
                <div className="p-4">
                  <div className="relative aspect-[4/3] border-4" style={{ borderColor: 'white' }}>
                    <Image
                      src={r.img}
                      alt={r.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 360px"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <MonoLabel color={C.tomato}>From: {r.country}</MonoLabel>
                      <h3 className="mt-1.5 text-xl leading-snug font-bold" style={{ color: C.ink }}>
                        {r.title}
                      </h3>
                    </div>
                    <div
                      className="flex h-14 w-12 shrink-0 items-center justify-center border border-dashed p-1 text-center font-stamp text-[8px] uppercase"
                      style={{ borderColor: C.sea, color: C.sea }}
                    >
                      Place stamp here
                    </div>
                  </div>
                  <div
                    className="mt-3 border-t border-dashed pt-2.5"
                    style={{ borderColor: `${C.ink}44` }}
                  >
                    <p className="font-stamp text-[11px] tracking-[0.14em]" style={{ color: C.olive }}>
                      {r.timeTotal} · serves {r.serves} · {r.region}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recipe page header snippet: sea-blue page ──────── */}
      <section style={{ backgroundColor: C.sea }}>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <MonoLabel color={C.turmeric}>Türkiye · Middle East · Recipe no. 07</MonoLabel>
          <h2 className="mt-4 max-w-2xl text-5xl leading-[1.02] font-black" style={{ color: C.cream }}>
            Çılbır, Turkish Eggs
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: `${C.cream}CC` }}>
            {SAMPLE_RECIPES[0].blurb}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              ['Active', SAMPLE_RECIPES[0].timeActive, C.turmeric, C.ink],
              ['Total', SAMPLE_RECIPES[0].timeTotal, C.pink, C.ink],
              ['Serves', SAMPLE_RECIPES[0].serves, C.cream, C.ink],
            ].map(([k, v, bg, fg]) => (
              <div key={k as string} className="px-5 py-3" style={{ backgroundColor: bg as string, color: fg as string }}>
                <p className="font-stamp text-[10px] uppercase tracking-[0.22em] opacity-70">{k}</p>
                <p className="text-lg font-black">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <Checkerboard height={16} />
      <footer style={{ backgroundColor: C.cream }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="text-sm font-black" style={{ color: C.tomato }}>
            nieves kitchen<span style={{ color: C.sea }}>*</span>
          </span>
          <span className="font-stamp text-[10px] uppercase tracking-[0.22em]" style={{ color: C.olive }}>
            Printed with love in every colour
          </span>
        </div>
      </footer>
    </div>
  );
}
