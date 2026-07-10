import Link from 'next/link';

/** The kitchen's one-line promise, centered between the cover and the departments. */
export default function PromiseLine() {
  return (
    <p className="text-center font-heading italic text-lg sm:text-xl text-brown-medium leading-relaxed max-w-2xl mx-auto">
      Every recipe here is{' '}
      <Link
        href="/promise"
        className="underline decoration-brown-light/40 underline-offset-2 hover:text-brown-dark transition-colors"
      >
        halal
      </Link>
      , kitchen-tested, and personally loved.
    </p>
  );
}
