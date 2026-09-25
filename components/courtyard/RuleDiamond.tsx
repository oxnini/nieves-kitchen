/**
 * RuleDiamond: the section break. A hairline on each side of a small
 * terracotta diamond. Decorative, so hidden from assistive tech.
 */
export function RuleDiamond({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-[18px] ${className}`}>
      <span className="h-px flex-1 bg-line" />
      <span className="size-[9px] rotate-45 bg-terracotta" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
