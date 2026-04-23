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

  return (
    <div className="w-full h-28">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--color-brown-light)" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="flavor"
            tick={{ fill: 'var(--color-brown-medium)', fontSize: 11, fontFamily: 'var(--font-figtree), system-ui, sans-serif' }}
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
