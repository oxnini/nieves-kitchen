'use client';

import { GitBranch } from 'lucide-react';

/**
 * Sibling card to Substitutions. Same visual treatment: warm surface,
 * Literata heading, line-separated entries.
 */
export default function VariationsCard({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-surface rounded-2xl p-5">
      <h2 className="font-heading text-lg font-semibold text-brown-dark mb-4 flex items-center gap-2">
        <GitBranch size={18} className="text-brown-medium" />
        Variations
      </h2>
      <div>
        {items.map((item, i) => (
          <p
            key={i}
            className="text-base text-brown-dark leading-relaxed py-3 border-b border-brown-light/15 last:border-0"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
