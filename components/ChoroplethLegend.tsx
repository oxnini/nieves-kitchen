'use client';

const LEVEL_LABELS: Record<string, string> = {
  continent: 'Recipes per continent',
  region: 'Recipes per region',
  country: 'Recipes per country',
};

interface ChoroplethLegendProps {
  level: 'continent' | 'region' | 'country';
  gradientFrom: string;
  gradientTo: string;
  hidden: boolean;
}

export default function ChoroplethLegend({
  level,
  gradientFrom,
  gradientTo,
  hidden,
}: ChoroplethLegendProps) {
  if (hidden) return null;

  return (
    <div className="absolute bottom-4 left-4 z-10 hidden sm:flex flex-col items-center gap-1.5 bg-parchment/92 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-brown-medium">fewer</span>
        <div
          className="w-20 h-1.5 rounded-full"
          style={{
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
            transition: 'background 0.4s ease',
          }}
        />
        <span className="text-[11px] text-brown-medium">more</span>
      </div>
      <span
        className="text-[10px] text-brown-medium/70 transition-opacity duration-300"
      >
        {LEVEL_LABELS[level]}
      </span>
    </div>
  );
}
