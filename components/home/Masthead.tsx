import Link from 'next/link';

export default function Masthead() {
  return (
    <header className="max-w-3xl">
      <div className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80">
        Nieves&#39; Kitchen
      </div>
      <h1 className="mt-2.5 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-dark tracking-tight leading-[1.05]">
        A well-travelled table, cooked with care
      </h1>
      <p className="mt-3 max-w-[58ch] text-brown-medium text-base sm:text-lg leading-relaxed">
        Every recipe here is{' '}
        <Link
          href="/promise"
          className="underline decoration-brown-light/40 underline-offset-2 hover:text-brown-dark transition-colors"
        >
          halal
        </Link>
        , kitchen-tested, and personally loved. Cook something nourishing tonight.
      </p>
    </header>
  );
}
