import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Eyebrow } from '@/components/courtyard';

export const metadata: Metadata = {
  title: "Page not found · Nieves's Kitchen",
};

// Shown for unknown routes and for notFound() (a recipe slug that doesn't
// exist). Same editorial header as /favorites and /recipes.
export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28">
      <Eyebrow tone="terracotta">Return to sender</Eyebrow>
      <h1 className="mt-2.5 font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-brown-dark tracking-tight leading-[1.05]">
        This page has wandered off the map.
      </h1>
      <p className="mt-4 max-w-xl text-brown-medium text-base sm:text-lg italic leading-relaxed">
        The link may be old, or the recipe may have moved. The kitchen is still here.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button href="/recipes">All recipes</Button>
        <Button href="/atlas" variant="secondary">Open the atlas</Button>
        <Link
          href="/"
          className="ml-1 text-[15px] text-teal underline decoration-teal/30 underline-offset-4 hover:decoration-teal/60 transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
