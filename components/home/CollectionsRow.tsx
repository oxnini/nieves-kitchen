import Link from 'next/link';
import { COLLECTIONS } from '@/lib/collections';

export default function CollectionsRow() {
  return (
    <section aria-label="Collections">
      <div className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80 mb-4">
        The Collections
      </div>
      <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {COLLECTIONS.map((c) => (
          <li key={c.slug}>
            <Link
              href={c.href}
              className="group block rounded-2xl border border-brown-light/25 bg-surface p-5 hover:border-terracotta/40 hover:shadow-md transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <h3 className="font-heading text-xl font-semibold text-brown-dark group-hover:text-terracotta transition-colors leading-snug">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm text-brown-medium leading-relaxed">
                {c.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
