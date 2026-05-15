'use client';

interface Props {
  /**
   * Distinguishes the two loading conditions: the React Suspense fallback that
   * fires while route hooks resolve, vs. the TanStack data fetch for the
   * booklet's recipes and stamps. Different copy lets us tell them apart in
   * the wild without changing the visual.
   */
  variant: 'shell' | 'data';
}

export default function BookletLoading({ variant }: Props) {
  const label = variant === 'shell' ? 'Unfolding the booklet' : 'Opening your passport';

  return (
    <div
      className="passport-light max-w-5xl mx-auto py-24 px-6 flex flex-col items-center"
      role="status"
      aria-live="polite"
    >
      <h2 className="font-heading italic text-[1.5625rem] text-brown-dark/85 text-center leading-tight">
        {label}
        <span aria-hidden className="inline-flex ml-0.5">
          <span className="loading-dot loading-dot-1">.</span>
          <span className="loading-dot loading-dot-2">.</span>
          <span className="loading-dot loading-dot-3">.</span>
        </span>
      </h2>

      <style jsx>{`
        @keyframes loading-dot-pulse {
          0%, 60%, 100% { opacity: 0.25; }
          30% { opacity: 0.9; }
        }
        .loading-dot {
          animation: loading-dot-pulse 1.4s ease-in-out infinite;
          display: inline-block;
        }
        .loading-dot-1 { animation-delay: 0s; }
        .loading-dot-2 { animation-delay: 0.2s; }
        .loading-dot-3 { animation-delay: 0.4s; }
        @media (prefers-reduced-motion: reduce) {
          .loading-dot { animation: none; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
