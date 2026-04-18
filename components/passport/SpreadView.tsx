'use client';

import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow, PassportSummary } from '@/lib/passport';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import Spread from './Spread';
import CoverPage from './CoverPage';
import InsideFrontSpread from './InsideFrontSpread';
import BackCoverSpread from './BackCoverSpread';
import RegionHalf from './RegionHalf';

interface Props {
  spread: SpreadDescriptor;
  spreads: SpreadDescriptor[];
  summary: PassportSummary;
  stampsPerCountry: Map<string, StampRow[]>;
  recipesByCountry: Map<string, Recipe[]>;
  onCooked: (country: string) => void;
  onUncooked: (country: string) => void;
  onJump: (spreadIndex: number) => void;
}

export default function SpreadView(props: Props) {
  const { spread } = props;

  switch (spread.kind) {
    case 'cover':
      return <CoverPage summary={props.summary} />;

    case 'inside-front':
      return (
        <Spread>
          <InsideFrontSpread
            summary={props.summary}
            spreads={props.spreads}
            stampsPerCountry={props.stampsPerCountry}
            onJumpToSpread={props.onJump}
          />
        </Spread>
      );

    case 'region':
      return (
        <Spread>
          <div
            className="h-full w-full grid"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <RegionHalf
              half={spread.left}
              stampsPerCountry={props.stampsPerCountry}
              recipesByCountry={props.recipesByCountry}
              onCookedClick={props.onCooked}
              onUncookedClick={props.onUncooked}
            />
            <RegionHalf
              half={spread.right}
              stampsPerCountry={props.stampsPerCountry}
              recipesByCountry={props.recipesByCountry}
              onCookedClick={props.onCooked}
              onUncookedClick={props.onUncooked}
            />
          </div>
        </Spread>
      );

    case 'back-cover':
      return (
        <Spread withSpine={false}>
          <BackCoverSpread summary={props.summary} />
        </Spread>
      );
  }
}
