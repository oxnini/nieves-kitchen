'use client';

import type { ReactNode } from 'react';

/* Panel building blocks for /dev/hero-viewport. Paper, not glass: the panel
   is lab chrome and stays solid so it never muddies the thing being judged. */

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <h3 className="font-heading text-[19px] leading-tight text-brown-dark">{title}</h3>
      <div className="mt-3 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function Slider({
  label, value, min, max, step = 1, unit = '', hint, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string; hint?: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between gap-3 font-body text-[14px] text-brown-dark">
        <span>{label}</span>
        <span className="tabular-nums">{value}{unit}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-teal"
      />
      {hint && <span className="mt-0.5 block font-body text-[13px] leading-snug text-brown-medium">{hint}</span>}
    </label>
  );
}

export function Choice<T extends string | number>({
  label, value, options, onChange, hint,
}: {
  label: string; value: T; options: [T, string][]; onChange: (v: T) => void; hint?: string;
}) {
  return (
    <div>
      <span className="block font-body text-[14px] text-brown-dark">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map(([v, text]) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={value === v}
            className={`rounded-full px-3 py-1.5 font-body text-[13.5px] ring-1 transition-colors ${
              value === v ? 'bg-teal text-cream ring-teal' : 'text-brown-dark ring-line hover:bg-brown-dark/[0.05]'
            }`}
          >
            {text}
          </button>
        ))}
      </div>
      {hint && <span className="mt-1 block font-body text-[13px] leading-snug text-brown-medium">{hint}</span>}
    </div>
  );
}
