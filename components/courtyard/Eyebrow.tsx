import type { ElementType, ReactNode } from 'react';

/**
 * Eyebrow — a small all-caps label above headings, cards, and tiles.
 * 12px Karla bold, uppercase, 0.22em tracking. Write the words in normal case;
 * the uppercase is purely visual.
 */
const TONE = {
  terracotta: 'text-terracotta',
  olive: 'text-olive',
  brass: 'text-brass',
  cream: 'text-cream',
} as const;

export function Eyebrow({
  children,
  tone = 'terracotta',
  as: Tag = 'p',
  className = '',
}: {
  children: ReactNode;
  tone?: keyof typeof TONE;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag className={`font-body text-[12px] font-bold tracking-[0.22em] uppercase ${TONE[tone]} ${className}`}>
      {children}
    </Tag>
  );
}
