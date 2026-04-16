import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { FlavorProfile } from "../types";

interface FlavorCompassProps {
  profile: FlavorProfile;
}

export default function FlavorCompass({ profile }: FlavorCompassProps) {
  const data = [
    { flavor: "Sweet", value: profile.sweet },
    { flavor: "Salty", value: profile.salty },
    { flavor: "Umami", value: profile.umami },
    { flavor: "Spicy", value: profile.spicy },
    { flavor: "Sour", value: profile.sour },
    { flavor: "Bitter", value: profile.bitter },
  ];

  return (
    <div className="w-full h-52">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#8D6E63" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="flavor"
            tick={{ fill: "#5D4037", fontSize: 12, fontFamily: "Inter" }}
          />
          <Radar
            dataKey="value"
            stroke="#E2725B"
            fill="#E2725B"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
