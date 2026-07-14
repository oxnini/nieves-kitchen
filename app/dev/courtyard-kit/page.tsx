'use client';

import Image from 'next/image';
import {
  Arch,
  Button,
  Chip,
  CourtyardCard,
  DestinationTile,
  DropCap,
  Eyebrow,
  Filmstrip,
  StepTile,
  TileGrid,
  TilePattern,
} from '@/components/courtyard';

/**
 * /dev/courtyard-kit — throwaway visual sandbox for the phase-4 Courtyard
 * primitives. Dev-only (gated by app/dev/layout.tsx). Not shipped navigation.
 */

const CARDS = [
  {
    slug: 'turkish-eggs',
    href: '/recipes/turkish-eggs',
    image: '/recipes/turkish-eggs-hero.webp',
    country: 'Türkiye',
    time: '25 min',
    title: 'Turkish eggs with yoghurt',
    blurb: 'Soft eggs over garlicky yoghurt under a spoonful of warm chilli butter. A fast breakfast.',
  },
  {
    slug: 'classic-lasagna',
    href: '/recipes/classic-lasagna',
    image: '/recipes/classic-lasagna-hero.webp',
    country: 'Italy',
    time: '2 hr',
    title: 'Classic lasagna al forno',
    blurb: 'Slow ragù, béchamel, and fresh pasta baked into layers. A Sunday project worth the wait.',
  },
  {
    slug: 'xinjiang-lamb-dumplings',
    href: '/recipes/xinjiang-lamb-dumplings',
    image: '/recipes/xinjiang-lamb-dumplings-hero.webp',
    country: 'China',
    time: '1 hr 30 min',
    title: 'Xinjiang lamb dumplings',
    blurb: 'Cumin-spiced lamb folded into pleated wrappers, pan-fried until the bottoms crisp.',
  },
  {
    slug: 'dumpling-lasagna',
    href: '/recipes/dumpling-lasagna',
    image: '/recipes/dumpling-lasagna-hero.webp',
    country: 'Fusion',
    time: '1 hr',
    title: 'Dumpling lasagna',
    blurb: 'Two comfort classics in one dish, layered and baked. A playful weeknight mashup.',
  },
];

const INK = [
  { slug: 'honey', src: '/pantry/honey.webp', label: 'Honey' },
  { slug: 'olive-oil', src: '/pantry/olive-oil.webp', label: 'Olive oil' },
  { slug: 'dates', src: '/pantry/dates.webp', label: 'Dates' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cobalt/10 py-12">
      <Eyebrow tone="olive" className="mb-4">
        {title}
      </Eyebrow>
      {children}
    </section>
  );
}

export default function CourtyardKitPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="bg-cobalt px-6 py-6 sm:px-10">
        <span className="font-heading text-[26px] leading-none text-cream">
          Nieves&rsquo;s <span className="italic text-brass">Kitchen</span>
        </span>
        <p className="mt-1 font-body text-[13px] text-cream/70">Courtyard primitives — /dev/courtyard-kit</p>
      </header>

      <main className="mx-auto max-w-5xl px-6 sm:px-10">
        {/* Arch */}
        <Section title="Arch (hero / recipe imagery)">
          <div className="flex flex-wrap items-end gap-10">
            <Arch
              src={CARDS[0].image}
              alt={CARDS[0].title}
              priority
              className="w-full max-w-[320px]"
              caption={
                <>
                  <Eyebrow tone="terracotta">{CARDS[0].country}</Eyebrow>
                  <span className="font-heading text-[16px] text-cobalt">{CARDS[0].title}</span>
                </>
              }
            />
            <Arch src={CARDS[1].image} alt={CARDS[1].title} ratio="aspect-[4/5]" className="w-full max-w-[220px]" />
          </div>
        </Section>

        {/* Type */}
        <Section title="Type — eyebrow + drop cap">
          <div className="space-y-2">
            <Eyebrow tone="terracotta">Halal home cooking</Eyebrow>
            <h1 className="font-heading text-[clamp(2.6rem,6vw,4.2rem)] leading-[1] text-cobalt">
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

        {/* Tile motif */}
        <Section title="Tile — pattern, step tiles, grid">
          <div className="flex flex-wrap items-start gap-8">
            <div className="relative h-32 w-48 overflow-hidden rounded-xl bg-cobalt">
              <TilePattern line="var(--color-cream)" opacity={0.5} />
            </div>
            <div className="flex items-center gap-3">
              <StepTile n={1} />
              <StepTile n={2} />
              <StepTile n={3} />
            </div>
            <div className="w-40">
              <TileGrid total={30} earned={9} columns={10} on="cream" />
            </div>
          </div>
        </Section>

        {/* Filmstrip of cards */}
        <Section title="Filmstrip — recipe cards">
          <Filmstrip ariaLabel="Sample recipes">
            {CARDS.map((c) => (
              <CourtyardCard
                key={c.slug}
                href={c.href}
                image={c.image}
                country={c.country}
                time={c.time}
                title={c.title}
                blurb={c.blurb}
                className="snap-start shrink-0"
              />
            ))}
          </Filmstrip>
        </Section>

        {/* Destination tiles */}
        <Section title="Destination tiles">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <DestinationTile tone="cobalt" eyebrow="Atlas" title="Explore by place" href="/atlas">
              <TileGrid total={15} earnedIndices={{ 1: 0, 4: 1, 6: 2, 9: 3, 12: 0 }} columns={5} />
              <p className="mt-3 font-body text-[13px] text-cream/80">Every country is a tile.</p>
            </DestinationTile>

            <DestinationTile tone="cobaltDeep" eyebrow="Your journal" title="8 tiles earned" href="/about">
              <TileGrid total={15} earnedIndices={{ 0: 0, 3: 1, 5: 2, 7: 3, 8: 0, 11: 1, 13: 2, 14: 3 }} columns={5} />
              <p className="mt-3 font-body text-[13px] text-cream/80">Cook a country, earn its tile.</p>
            </DestinationTile>

            <DestinationTile tone="terracotta" eyebrow="Collections" title="Ways in" href="/recipes">
              <div className="flex flex-wrap gap-1.5">
                {['Travels', 'High protein', 'Sides', 'Sunnah'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-cream/90 px-2.5 py-1 font-body text-[11px] font-bold text-terracotta"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </DestinationTile>

            <DestinationTile tone="cobalt" eyebrow="Pantry" title="Every ingredient" href="/pantry">
              <div className="flex gap-2">
                {INK.map((a) => (
                  <div key={a.slug} className="relative h-14 w-14 rounded-lg bg-cream p-1.5">
                    <Image src={a.src} alt={`${a.label}, ink drawing`} fill sizes="56px" className="object-contain" />
                  </div>
                ))}
              </div>
            </DestinationTile>
          </div>
        </Section>

        <div className="h-16" />
      </main>
    </div>
  );
}
