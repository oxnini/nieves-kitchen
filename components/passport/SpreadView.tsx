'use client';

import type { Recipe } from '@/lib/types';
import type { Stamp as StampRow, PassportSummary } from '@/lib/passport';
import type { SpreadDescriptor } from './hooks/usePassportSpreads';
import { useIsMobile } from '@/hooks/useIsMobile';
import Spread from './Spread';
import CoverPage from './CoverPage';
import InsideFrontSpread from './InsideFrontSpread';
import ContentsSpread from './ContentsSpread';
import BackCoverSpread from './BackCoverSpread';
import RegionHalf from './RegionHalf';

interface Props {
  spread: SpreadDescriptor;
  spreads: SpreadDescriptor[];
  summary: PassportSummary;
  stampsPerCountry: Map<string, StampRow[]>;
  recipes: Recipe[];
  recipesByCountry: Map<string, Recipe[]>;
  onCooked: (country: string) => void;
  onJump: (spreadIndex: number) => void;
}

export default function SpreadView(props: Props) {
  const { spread } = props;
  const mobile = useIsMobile();

  switch (spread.kind) {
    case 'cover':
      return <CoverPage summary={props.summary} />;

    case 'inside-front':
      return (
        <Spread>
          <InsideFrontSpread
            summary={props.summary}
            recipes={props.recipes}
          />
        </Spread>
      );

    case 'contents':
      return (
        <Spread>
          <ContentsSpread
            summary={props.summary}
            spreads={props.spreads}
            recipes={props.recipes}
            onJumpToSpread={props.onJump}
          />
        </Spread>
      );

    case 'region': {
      if (mobile) {
        return (
          <Spread region={spread.region}>
            <RegionHalf
              region={spread.region}
              countries={[...spread.leftCountries, ...spread.rightCountries]}
              showHeader
              continuationIndex={spread.continuationIndex}
              stampsPerCountry={props.stampsPerCountry}
              onCookedClick={props.onCooked}
            />
          </Spread>
        );
      }
      return (
        <Spread region={spread.region}>
          <div
            className="h-full w-full grid"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <RegionHalf
              region={spread.region}
              countries={spread.leftCountries}
              showHeader
              continuationIndex={spread.continuationIndex}
              stampsPerCountry={props.stampsPerCountry}
              onCookedClick={props.onCooked}
            />
            <RegionHalf
              region={spread.region}
              countries={spread.rightCountries}
              showHeader={false}
              continuationIndex={spread.continuationIndex}
              stampsPerCountry={props.stampsPerCountry}
              onCookedClick={props.onCooked}
            />
          </div>
        </Spread>
      );
    }

    case 'back-cover':
      return <BackCoverSpread summary={props.summary} />;
  }
}
