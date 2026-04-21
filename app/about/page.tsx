import Link from 'next/link';
import { FullStoryDropdown } from './FullStoryDropdown';

export const metadata = {
  title: "About — Nieves' Kitchen",
  description: "Learn about the story behind Nieves' Kitchen — halal recipes from around the world.",
};

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

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">

      {/* Header — left-aligned, editorial */}
      <header className="mb-16 sm:mb-20 max-w-3xl">
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-dark tracking-tight leading-[1.1]">
          About Nieves&#39; Kitchen
        </h1>
        <p className="mt-3 text-brown-medium text-sm sm:text-base italic">
          (it&apos;s pronounced nee-EH-ves)
        </p>
      </header>

      {/* Main content — wider column with breathing room */}
      <article className="text-brown-dark leading-relaxed text-base sm:text-lg">

        {/* Intro section */}
        <div className="max-w-[65ch]">
          <p className="first-letter:font-heading first-letter:text-[3.2rem] first-letter:sm:text-[3.8rem] first-letter:font-bold first-letter:text-terracotta first-letter:float-left first-letter:leading-[0.8] first-letter:mr-2 first-letter:mt-1 mb-6">
            This is a collection of recipes from someone who has never been able to stick to just one
            cuisine. Every recipe here is <strong>100% halal</strong>, personally tried, tested, and
            deeply loved.
          </p>
          <p className="mb-6">
            I&apos;m Chinese, I grew up in{' '}
            <PlaceLink lat={40} lng={-3.7} zoom={5}>Spain</PlaceLink>, and I now live
            in <PlaceLink lat={51.5} lng={-0.1} zoom={5.5}>London</PlaceLink>. I&apos;ve eaten my way
            through street markets in{' '}
            <PlaceLink lat={37.5} lng={127} zoom={5.5}>Seoul</PlaceLink>, ordered the same seafood
            salad five times in a row in{' '}
            <PlaceLink lat={15} lng={101} zoom={5}>Thailand</PlaceLink>, and I still think about the
            bun cha I had in{' '}
            <PlaceLink lat={16} lng={108} zoom={5}>Vietnam</PlaceLink>. I cook everything
            from <PlaceLink lat={40} lng={80} zoom={4.5}>Uyghur</PlaceLink> lamb dumplings to
            seafood <PlaceLink lat={40} lng={-3.7} zoom={5}>paella</PlaceLink>{' '}
            to <PlaceLink lat={37.5} lng={127} zoom={5.5}>Korean</PlaceLink> street food, and this
            site is where all of that comes together.
          </p>
        </div>

        {/* Pull quote — breaks out wider, top rule only, thicker */}
        <blockquote className="relative my-14 sm:my-20 pt-8 sm:pt-10 max-w-3xl border-t-2 border-brown-light/50">
          <p className="font-heading text-xl sm:text-2xl lg:text-3xl text-brown-dark italic leading-snug">
            Most of my recipes are built with nutrition and protein in mind, but not everything here
            is about macros. Some dishes are on this site purely because they taste too good not to share.
          </p>
        </blockquote>

        {/* Closing intro */}
        <div className="max-w-[65ch]">
          <p className="mb-6">
            The map is there because that&apos;s how I think about food: through places, memories, and
            flavors I&apos;ve picked up along the way. This collection is always growing, so keep coming back.
          </p>
        </div>

        {/* Full story dropdown */}
        <div className="max-w-[65ch]">
          <FullStoryDropdown />
        </div>
      </article>

      {/* CTAs — left-aligned to match the editorial flow */}
      <div className="mt-14 sm:mt-16 flex flex-wrap items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded bg-terracotta text-white text-sm font-medium hover:bg-terracotta/90 transition-colors"
        >
          Explore the map
        </Link>
        <Link
          href="/recipes"
          className="text-sm text-brown-medium hover:text-brown-dark transition-colors underline underline-offset-4 decoration-brown-light/40"
        >
          Or browse all recipes
        </Link>
      </div>

      {/* Colophon — stamp-style, editorial close */}
      <footer className="mt-20 sm:mt-24 pt-8 border-t border-brown-light/30">
        <p className="font-stamp text-xs sm:text-sm text-brown-light tracking-[0.15em]">
          100% Halal &middot; Globally Inspired &middot; Macro-Friendly &middot; Tried &amp; Tested
        </p>
      </footer>
    </div>
  );
}
