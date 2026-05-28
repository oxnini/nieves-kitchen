'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

/**
 * Visual A/B for the new floating navbar.
 *
 * The page renders a fake map-like background (no real topology — we're
 * judging the navbar's weight, not the map). A toggle button at bottom-right
 * swaps between the production Navbar and the new FloatingNavbar so the
 * user can compare on a real phone before the production swap.
 */
export default function FloatingNavbarPreviewPage() {
  const [variant, setVariant] = useState<'new' | 'current'>('new');

  return (
    <div className="fixed inset-0 bg-map-base">
      {/* Fake "map" — gradient + a few warm blobs so the navbar sits over
          something visually noisy enough to judge legibility. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(196,150,108,0.35), transparent 40%), ' +
            'radial-gradient(circle at 70% 60%, rgba(160,120,90,0.28), transparent 45%), ' +
            'radial-gradient(circle at 50% 85%, rgba(120,90,70,0.22), transparent 50%)',
        }}
      />

      {variant === 'current' ? (
        <Navbar />
      ) : (
        // FloatingNavbar replaces this in Task 4; for now render the same
        // Navbar so the toggle is wired and we can verify the route loads.
        <Navbar />
      )}

      {/* A/B toggle — bottom-right, never covered by either navbar */}
      <button
        type="button"
        onClick={() => setVariant(v => (v === 'new' ? 'current' : 'new'))}
        className="fixed bottom-4 right-4 z-[100] px-4 py-2 rounded-full bg-brown-dark text-parchment text-sm font-medium shadow-lg"
      >
        Showing: {variant === 'new' ? 'NEW' : 'CURRENT'} (tap to swap)
      </button>
    </div>
  );
}
