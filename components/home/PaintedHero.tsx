import Image from 'next/image';
import { Button } from '@/components/courtyard';

/**
 * The home hero: a full-bleed painting (the user's own render of a tiled
 * courtyard) with the pitch on a paper plate. Text always sits on paper,
 * never on the image. This is the one place full-bleed is allowed: the art
 * was made for this slot (spec 2026-09-25 §6.1). Server-safe, no data.
 */
export default function PaintedHero() {
  return (
    <section className="relative" aria-labelledby="hero-heading">
      <div className="relative h-[340px] sm:h-[480px] lg:h-[640px] bg-parchment-dark">
        <Image
          src="/home/hero-courtyard.webp"
          alt="A painted tiled courtyard: an arch onto cypress trees and the sea, and a bowl of citrus and pomegranates"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative mx-auto max-w-[1160px] px-4 sm:px-10 -mt-[72px] lg:mt-0 lg:absolute lg:inset-0 lg:flex lg:items-end lg:pb-14 lg:pointer-events-none">
        <div className="max-w-[540px] rounded-[3px] bg-surface px-[22px] py-7 sm:px-11 sm:py-10 ring-1 ring-line shadow-[0_24px_50px_-30px_rgba(0,0,0,0.55)] lg:pointer-events-auto">
          <p className="flex items-center gap-2.5 font-body text-[13.5px] text-brown-dark/90">
            <span aria-hidden="true" className="size-[7px] rotate-45 bg-current" />
            Every recipe is halal
          </p>
          <h1
            id="hero-heading"
            className="mt-5 font-heading font-normal text-[clamp(2.3rem,3.9vw,3.4rem)] leading-[1.02] tracking-[-0.022em] text-brown-dark text-balance"
          >
            Recipes from around the world, cooked at home.
          </h1>
          <p className="mt-6 max-w-[38ch] font-body text-[16.5px] leading-relaxed text-brown-dark/85">
            Dishes I&apos;ve eaten on the road and learned to make in my own kitchen. Pick a place,
            pick a dish, and start cooking tonight.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary" href="/recipes">Browse recipes</Button>
            <Button variant="secondary" href="/atlas">Open the atlas</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
