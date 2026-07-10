import Link from 'next/link';

/**
 * The ruled department header idiom for the home's "inside" sections:
 * Cutive Mono small-caps label, hairline rule, optional right-side link.
 */
export default function DepartmentHeader({
  label,
  id,
  link,
}: {
  label: string;
  id?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex items-baseline gap-4 mb-5">
      <h2
        id={id}
        className="font-stamp text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-brown-medium/80 whitespace-nowrap"
      >
        {label}
      </h2>
      <span className="flex-1 h-px bg-brown-light/30 self-center" aria-hidden="true" />
      {link && (
        <Link
          href={link.href}
          className="text-sm text-brown-medium hover:text-brown-dark underline decoration-brown-light/40 underline-offset-2 transition-colors whitespace-nowrap"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
