import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/courtyard';

/**
 * The home hero, "book jacket": the pitch is set straight onto a full-bleed
 * painting, like the title on a cookbook cover, over a soft glow of the page
 * colour (`.hero-glow` in globals.css) that keeps it readable without a box
 * edge. By day it is the courtyard painting with a mist glow; at night the
 * dusk render of the same scene with a night-paper glow, so the hero sits in
 * the dark page instead of glaring out of it (`.hero-day` / `.hero-dusk`).
 * User decision 2026-09-27, tuned in /dev/hero (spec 2026-09-25 §6.1).
 * The halal label links to /promise (R33). Server-safe, no data.
 */
const ALT =
  'A painted tiled courtyard: an arch onto cypress trees and the sea, and a bowl of citrus and pomegranates';

export default function PaintedHero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="relative h-[640px] sm:h-[600px] lg:h-[640px] bg-parchment-dark">
        <div className="hero-day absolute inset-0">
          <Image
            src="/home/hero-courtyard.webp"
            alt={ALT}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[12%_center] lg:object-center"
          />
        </div>
        {/* Lazy on purpose: display:none keeps it from loading by day. */}
        <div className="hero-dusk absolute inset-0">
          <Image
            src="/home/hero-courtyard-dusk.webp"
            alt={`${ALT}, at dusk`}
            fill
            sizes="100vw"
            className="object-cover object-[12%_center] lg:object-center"
          />
        </div>
        <div className="absolute inset-0 mx-auto flex max-w-[1160px] flex-col justify-center px-4 pb-10 sm:px-10 lg:pb-0">
          <div className="relative max-w-[520px]">
            <div
              aria-hidden="true"
              className="hero-glow absolute -inset-x-[600px] -inset-y-[500px] sm:-inset-x-[1000px] sm:-inset-y-[800px]"
            />
            <div className="relative">
              <p className="font-body text-[13.5px] text-brown-dark/90">
                <Link
                  href="/promise"
                  className="inline-flex items-center gap-2.5 underline-offset-4 decoration-1 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
                >
                  <span aria-hidden="true" className="size-[7px] rotate-45 bg-current" />
                  Every recipe is halal
                </Link>
              </p>
              <h1
                id="hero-heading"
                className="mt-5 font-heading font-normal text-[2.6rem] sm:text-[clamp(2.6rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.022em] text-brown-dark text-balance"
              >
                Recipes from around the world, cooked at home.
              </h1>
              <p className="mt-6 max-w-[34ch] font-body text-[16.5px] leading-relaxed text-brown-dark">
                Dishes I&apos;ve eaten on the road and learned to make in my own kitchen. Pick a place,
                pick a dish, and start cooking tonight.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="primary" href="/recipes">Browse recipes</Button>
                <Button variant="secondary" href="/atlas">Open the atlas</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
