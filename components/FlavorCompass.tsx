'use client';

import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer,
} from 'recharts';
import type { FlavorProfile } from '@/lib/types';

export default function FlavorCompass({ profile }: { profile: FlavorProfile }) {
  const data = [
    { flavor: 'Sweet',  value: profile.sweet  },
    { flavor: 'Salty',  value: profile.salty  },
    { flavor: 'Umami',  value: profile.umami  },
    { flavor: 'Spicy',  value: profile.spicy  },
    { flavor: 'Sour',   value: profile.sour   },
    { flavor: 'Bitter', value: profile.bitter },
  ];

  const strongest = data.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <div
      className="w-full h-full min-h-[160px] select-none"
      role="img"
      aria-label={`Flavor profile chart; strongest note: ${strongest.flavor.toLowerCase()}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        {/* accessibilityLayer makes the whole svg focusable (tabIndex=0), which
            paints the browser's default focus ring around the chart on click.
            The chart is static (no tooltip or keyboard interaction), so drop
            the layer and describe it via the wrapper's role/aria-label. */}
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%" accessibilityLayer={false}>
          <PolarGrid stroke="var(--color-brown-light)" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="flavor"
            tick={{ fill: 'var(--color-brown-dark)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-figtree), system-ui, sans-serif' }}
          />
          <Radar
            dataKey="value"
            stroke="var(--color-terracotta)"
            fill="var(--color-terracotta)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
