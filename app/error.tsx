'use client';

import { useEffect } from 'react';
import { Button, Eyebrow } from '@/components/courtyard';

// Route-level error boundary: a thrown render error lands here, inside the
// site's own navbar and footer, instead of the framework's error screen.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28">
      <Eyebrow tone="terracotta">A spill in the kitchen</Eyebrow>
      <h1 className="mt-2.5 font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-brown-dark tracking-tight leading-[1.05]">
        This page didn&rsquo;t come together.
      </h1>
      <p className="mt-4 max-w-xl text-brown-medium text-base sm:text-lg italic leading-relaxed">
        Nothing you did. Try it again, and if it still won&rsquo;t load, the recipes are all where you left them.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button href="/recipes" variant="secondary">All recipes</Button>
      </div>
    </div>
  );
}
