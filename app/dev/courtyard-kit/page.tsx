'use client';

import { Button, Chip, DropCap, Eyebrow, RuleDiamond } from '@/components/courtyard';

/**
 * /dev/courtyard-kit — throwaway visual sandbox for the surviving Courtyard
 * primitives. Dev-only (gated by app/dev/layout.tsx). Not shipped navigation.
 * The tile primitives (Arch, CourtyardCard, DestinationTile, Filmstrip,
 * StepTile, TileGrid, TilePattern) were retired in phase 9 of the premium
 * revamp; see docs/superpowers/specs/2026-09-25-premium-revamp-design.md §12.
 */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-teal/10 py-12">
      <Eyebrow tone="muted" className="mb-4">
        {title}
      </Eyebrow>
      {children}
    </section>
  );
}

export default function CourtyardKitPage() {
  return (
    <div className="min-h-screen bg-parchment text-brown-dark">
      <header className="bg-teal px-6 py-6 sm:px-10">
        <span className="font-heading text-[26px] leading-none text-parchment">
          Nieves&rsquo;s <span className="italic text-terracotta">Kitchen</span>
        </span>
        <p className="mt-1 font-body text-[13px] text-parchment/70">Courtyard primitives — /dev/courtyard-kit</p>
      </header>

      <main className="mx-auto max-w-5xl px-6 sm:px-10">
        {/* Type */}
        <Section title="Type — eyebrow + drop cap">
          <div className="space-y-2">
            <Eyebrow tone="terracotta">Halal home cooking</Eyebrow>
            <h1 className="font-heading font-normal text-[clamp(2.6rem,6vw,4.2rem)] leading-[1] text-brown-dark">
              Cook your way <span className="italic text-terracotta">around</span> the world.
            </h1>
          </div>
          <div className="mt-6 max-w-md">
            <DropCap>
              Recipes collected from trips and tested at home. Pick a place, pick a dish, and start cooking tonight.
            </DropCap>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Browse recipes</Button>
            <Button variant="secondary">Open the atlas</Button>
            <Button variant="accent">Start cooking</Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </Section>

        {/* Chips */}
        <Section title="Chips (Jump in)">
          <div className="flex flex-wrap gap-2">
            <Chip active>Türkiye</Chip>
            <Chip>Italy</Chip>
            <Chip>China</Chip>
            <Chip>High protein</Chip>
            <Chip>Quick</Chip>
          </div>
        </Section>

        {/* Rule diamond */}
        <Section title="Section break">
          <RuleDiamond />
        </Section>

        <div className="h-16" />
      </main>
    </div>
  );
}
