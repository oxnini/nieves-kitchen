'use client';

import { useState } from 'react';
import Link from 'next/link';

/** Subtle inline link that flies the map to a specific place */
function PlaceLink({ lat, lng, zoom, children }: { lat: number; lng: number; zoom?: number; children: React.ReactNode }) {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  if (zoom) params.set('zoom', String(zoom));
  return (
    <Link
      href={`/?${params}`}
      className="text-terracotta/85 underline decoration-terracotta/30 underline-offset-2 hover:decoration-terracotta/60 transition-colors"
    >
      {children}
    </Link>
  );
}

export function FullStoryDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-10 pt-8 border-t border-brown-light/30">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="group flex items-center gap-3 font-heading text-lg sm:text-xl font-semibold text-terracotta hover:text-terracotta/80 transition-colors cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 1l8 5-8 5V1z" />
        </svg>
        Read my full story
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pt-8 text-brown-dark leading-relaxed text-base sm:text-lg">

            <p className="mb-6">
              I didn&apos;t grow up dreaming of being a cook. What actually happened was much more
              ordinary. My mum would come home from work and I&apos;d abandon whatever homework I was
              supposed to be doing to help her in the kitchen. She called me her sous chef, which
              sounds cute, but really I was just washing vegetables, chopping things, and cleaning up.
              For a while it honestly felt like a chore.
            </p>
            <p className="mb-6">
              But something shifted around the time I was 13. I started paying attention. Not just to
              the tasks she gave me, but to what she was doing and why. By 15 I was cooking full meals
              on my own and making dinner for my younger sister when my parents weren&apos;t home.
              That&apos;s when cooking stopped being something I helped with and became something that
              was mine.
            </p>

            {/* Visual break — the Reddit moment */}
            <p className="my-10 font-heading text-lg sm:text-xl italic text-brown-medium leading-snug">
              That night made me realize that I don&apos;t just love cooking.
              I love sharing it, breaking it down, and helping other people get it right.
            </p>

            <p className="mb-6">
              One evening I posted some pictures of homemade Uyghur lamb dumplings on Reddit. Pan
              fried and steamed. I didn&apos;t think much of it, but then the comments started flooding
              in. Strangers asking how I made them, wanting the full recipe. So I sat there and wrote
              out a proper detailed guide for every single person who asked. I could have just dropped
              a quick summary, but I didn&apos;t want to.
            </p>

            {/* Section marker */}
            <div className="my-10 flex items-center gap-4">
              <span className="h-px flex-1 bg-brown-light/20 [data-theme=sepia]_&:bg-brown-light/35" />
              <span className="font-stamp text-[0.65rem] text-brown-light tracking-[0.2em]">Places</span>
              <span className="h-px flex-1 bg-brown-light/20" />
            </div>

            <p className="mb-6">
              Growing up in <PlaceLink lat={40} lng={-3.7} zoom={5}>Spain</PlaceLink> meant I was
              surrounded by incredible food from the start. Seafood paella in Costa Brava with alioli
              on the side is still one of my all-time favorites. But traveling is what really opened
              everything up. In <PlaceLink lat={37.5} lng={127} zoom={5.5}>Seoul</PlaceLink> I lost
              track of time wandering through street food markets.
              In <PlaceLink lat={16} lng={108} zoom={5}>Vietnam</PlaceLink> I tried bun cha and fell
              in love, and don&apos;t even get me started on Vietnamese coffee.
              In <PlaceLink lat={15} lng={101} zoom={5}>Thailand</PlaceLink> I discovered a seafood
              salad that I ordered again and again and couldn&apos;t stop thinking about when I got
              home. I&apos;ve had <PlaceLink lat={5} lng={46} zoom={5}>Somali</PlaceLink> food with
              banana on the side and thought &ldquo;why did nobody tell me about this
              sooner.&rdquo; Every place I visit gives me something new to bring into my kitchen.
            </p>

            {/* Section marker */}
            <div className="my-10 flex items-center gap-4">
              <span className="h-px flex-1 bg-brown-light/20" />
              <span className="font-stamp text-[0.65rem] text-brown-light tracking-[0.2em]">Faith &amp; Food</span>
              <span className="h-px flex-1 bg-brown-light/20" />
            </div>

            <p className="mb-6">
              When I found Islam about a year ago, my cooking didn&apos;t shrink. It shifted. Some
              ingredients I used to rely on, like rice wine in Chinese cooking, were no longer an
              option. So I learned to work around them, finding alternatives and substitutions that
              keep the soul of a dish intact. It&apos;s honestly made me a more creative cook. And I
              want this site to show that halal food spans every cuisine, every culture, and every
              flavor profile you can think of. This space is for everyone, and I hope the recipes speak
              for themselves.
            </p>
            <p>
              The map you see on this site isn&apos;t just a navigation tool. It&apos;s how I
              experience food: through places, memories, and flavors. And this collection is always
              growing. I&apos;m constantly experimenting, tweaking, and discovering new dishes. So
              stick around, explore the map, and if you make something from this site, I&apos;d
              genuinely love to hear about it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
