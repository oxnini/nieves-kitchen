import { Arch, Button, Chip, Eyebrow, TilePattern } from '@/components/courtyard';

/**
 * The home hero (Courtyard "1A The Spread"). A two-column magazine opener:
 * the pitch, primary actions, and "Jump in" chips on the left; one arched
 * feature dish on a terracotta block on the right. Server-safe (no data).
 */

/** Fast entry points. Countries link into the recipe list; the last two are lenses. */
const JUMP_IN: { label: string; href: string }[] = [
  { label: 'Turkey', href: '/recipes?country=Turkey' },
  { label: 'Italy', href: '/recipes?country=Italy' },
  { label: 'China', href: '/recipes?country=China' },
  { label: 'High protein', href: '/recipes?collection=high-protein' },
  { label: 'From my travels', href: '/atlas' },
];

export default function CourtyardHero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-6 pb-4 sm:px-10 sm:pt-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* Left: the pitch */}
        <div>
          <Eyebrow tone="terracotta">Halal home cooking</Eyebrow>
          <h1 className="mt-3 font-heading text-[clamp(2.6rem,6vw,4.2rem)] font-normal leading-[1.02] text-brown-dark">
            Cook your way <span className="italic text-terracotta">around</span> the world.
          </h1>
          <p className="mt-5 max-w-md font-body text-[17px] leading-relaxed text-ink/80">
            Global, always-halal recipes collected on trips and tested at home. Pick a place,
            pick a dish, and start cooking tonight.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" href="/recipes">
              Browse recipes
            </Button>
            <Button variant="secondary" size="lg" href="/atlas">
              Open the atlas
            </Button>
          </div>

          <div className="mt-8">
            <Eyebrow tone="olive" className="mb-3">
              Jump in
            </Eyebrow>
            <div className="flex flex-wrap gap-2">
              {JUMP_IN.map((j) => (
                <Chip key={j.label} href={j.href}>
                  {j.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Right: one arched feature dish on a terracotta block */}
        <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl bg-terracotta p-7 sm:p-9">
          <TilePattern line="var(--color-cream)" opacity={0.12} />
          <div className="relative">
            <Arch
              src="/recipes/turkish-eggs-hero.webp"
              alt="Turkish eggs with yoghurt and chilli butter"
              priority
              sizes="(max-width: 640px) 80vw, 360px"
              caption={
                <>
                  <Eyebrow tone="terracotta">Turkey</Eyebrow>
                  <span className="font-heading text-[16px] text-cobalt">Turkish eggs</span>
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
