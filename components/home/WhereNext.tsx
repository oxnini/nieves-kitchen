import Link from 'next/link';
import { currentCover, coverMonthYear } from '@/data/covers';
import DepartmentHeader from '@/components/home/DepartmentHeader';

/**
 * The back page: one rotating "where next?" pull toward the atlas (the
 * journal principle allows exactly one explore-pull, never a scoreboard),
 * then the end-mark that closes the cover.
 */
export default function WhereNext() {
  const cover = currentCover();
  return (
    <section aria-labelledby="where-next-heading">
      <DepartmentHeader id="where-next-heading" label="Where Next" />
      <Link
        href="/atlas"
        className="group block text-center px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta rounded-xl"
      >
        <p className="font-heading italic text-xl sm:text-2xl text-brown-dark leading-relaxed group-hover:text-terracotta transition-colors">
          {cover.whereNext.line}
        </p>
        <span className="mt-2 inline-block text-sm text-brown-medium underline decoration-brown-light/40 underline-offset-2">
          Open the atlas
        </span>
      </Link>
      <p className="mt-10 text-center font-stamp text-[10px] uppercase tracking-[0.3em] text-brown-medium/70">
        Nieves&#39;s Kitchen · {coverMonthYear(cover)} · Until the next table
      </p>
    </section>
  );
}
