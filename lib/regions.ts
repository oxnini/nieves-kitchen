import type { CulinaryRegion } from './types';

export const CHOROPLETH_BASE = { r: 160, g: 90, b: 60 };
export const CHOROPLETH_LIGHT = '#E3D4C4';
export const CHOROPLETH_EMPTY = '#ECE5DB';

export const COUNTRY_TO_REGION: Record<string, CulinaryRegion> = {
  // Western Europe
  '724': 'Western Europe', '380': 'Western Europe', '250': 'Western Europe',
  '276': 'Western Europe', '826': 'Western Europe', '620': 'Western Europe',
  '528': 'Western Europe', '056': 'Western Europe', '756': 'Western Europe',
  '040': 'Western Europe', '372': 'Western Europe', '442': 'Western Europe',
  '208': 'Western Europe', '578': 'Western Europe', '752': 'Western Europe',
  '246': 'Western Europe', '352': 'Western Europe',

  // Eastern Europe
  '300': 'Eastern Europe', '616': 'Eastern Europe', '203': 'Eastern Europe',
  '348': 'Eastern Europe', '642': 'Eastern Europe', '100': 'Eastern Europe',
  '688': 'Eastern Europe', '191': 'Eastern Europe', '705': 'Eastern Europe',
  '703': 'Eastern Europe', '804': 'Eastern Europe', '112': 'Eastern Europe',
  '498': 'Eastern Europe', '070': 'Eastern Europe', '499': 'Eastern Europe',
  '008': 'Eastern Europe', '807': 'Eastern Europe', '643': 'Eastern Europe',
  '440': 'Eastern Europe', '428': 'Eastern Europe', '233': 'Eastern Europe',
  '268': 'Eastern Europe', '051': 'Eastern Europe', '031': 'Eastern Europe',

  // East Asia
  '156': 'East Asia', '158': 'East Asia', '496': 'East Asia',

  // Japan & Korea
  '392': 'Japan & Korea', '410': 'Japan & Korea', '408': 'Japan & Korea',

  // Southeast Asia
  '764': 'Southeast Asia', '704': 'Southeast Asia', '458': 'Southeast Asia',
  '360': 'Southeast Asia', '608': 'Southeast Asia', '104': 'Southeast Asia',
  '116': 'Southeast Asia', '418': 'Southeast Asia', '096': 'Southeast Asia',

  // South Asia
  '356': 'South Asia', '586': 'South Asia', '050': 'South Asia',
  '144': 'South Asia', '524': 'South Asia', '064': 'South Asia', '004': 'South Asia',

  // Middle East
  '792': 'Middle East', '422': 'Middle East', '760': 'Middle East',
  '400': 'Middle East', '368': 'Middle East', '364': 'Middle East',
  '682': 'Middle East', '784': 'Middle East', '634': 'Middle East',
  '414': 'Middle East', '512': 'Middle East', '887': 'Middle East',
  '376': 'Middle East', '275': 'Middle East', '196': 'Middle East',

  // North Africa
  '504': 'North Africa', '012': 'North Africa', '788': 'North Africa',
  '434': 'North Africa', '818': 'North Africa', '729': 'North Africa', '478': 'North Africa',

  // Sub-Saharan Africa
  '566': 'Sub-Saharan Africa', '404': 'Sub-Saharan Africa', '231': 'Sub-Saharan Africa',
  '288': 'Sub-Saharan Africa', '710': 'Sub-Saharan Africa', '834': 'Sub-Saharan Africa',
  '800': 'Sub-Saharan Africa', '120': 'Sub-Saharan Africa', '686': 'Sub-Saharan Africa',
  '384': 'Sub-Saharan Africa', '508': 'Sub-Saharan Africa', '450': 'Sub-Saharan Africa',
  '024': 'Sub-Saharan Africa', '894': 'Sub-Saharan Africa', '716': 'Sub-Saharan Africa',
  '454': 'Sub-Saharan Africa', '466': 'Sub-Saharan Africa', '854': 'Sub-Saharan Africa',
  '562': 'Sub-Saharan Africa', '148': 'Sub-Saharan Africa', '180': 'Sub-Saharan Africa',
  '178': 'Sub-Saharan Africa', '266': 'Sub-Saharan Africa', '226': 'Sub-Saharan Africa',
  '694': 'Sub-Saharan Africa', '430': 'Sub-Saharan Africa', '324': 'Sub-Saharan Africa',
  '768': 'Sub-Saharan Africa', '204': 'Sub-Saharan Africa', '072': 'Sub-Saharan Africa',
  '516': 'Sub-Saharan Africa', '748': 'Sub-Saharan Africa', '426': 'Sub-Saharan Africa',
  '646': 'Sub-Saharan Africa', '108': 'Sub-Saharan Africa', '706': 'Sub-Saharan Africa',
  '232': 'Sub-Saharan Africa', '262': 'Sub-Saharan Africa', '140': 'Sub-Saharan Africa',
  '728': 'Sub-Saharan Africa',

  // Caribbean & Americas
  '840': 'Caribbean & Americas', '124': 'Caribbean & Americas', '484': 'Caribbean & Americas',
  '076': 'Caribbean & Americas', '032': 'Caribbean & Americas', '170': 'Caribbean & Americas',
  '604': 'Caribbean & Americas', '152': 'Caribbean & Americas', '862': 'Caribbean & Americas',
  '218': 'Caribbean & Americas', '068': 'Caribbean & Americas', '600': 'Caribbean & Americas',
  '858': 'Caribbean & Americas', '328': 'Caribbean & Americas', '740': 'Caribbean & Americas',
  '192': 'Caribbean & Americas', '388': 'Caribbean & Americas', '332': 'Caribbean & Americas',
  '214': 'Caribbean & Americas', '780': 'Caribbean & Americas', '591': 'Caribbean & Americas',
  '188': 'Caribbean & Americas', '320': 'Caribbean & Americas', '340': 'Caribbean & Americas',
  '222': 'Caribbean & Americas', '558': 'Caribbean & Americas', '084': 'Caribbean & Americas',
};

export const REGION_CENTERS: Record<CulinaryRegion, { center: [number, number]; zoom: number }> = {
  'Western Europe':       { center: [5, 48],    zoom: 4   },
  'Eastern Europe':       { center: [25, 50],   zoom: 3.5 },
  'East Asia':            { center: [105, 35],  zoom: 3.5 },
  'Japan & Korea':        { center: [135, 37],  zoom: 4.5 },
  'Southeast Asia':       { center: [110, 5],   zoom: 3.5 },
  'South Asia':           { center: [78, 22],   zoom: 3.5 },
  'Middle East':          { center: [45, 30],   zoom: 3.5 },
  'North Africa':         { center: [10, 30],   zoom: 3.5 },
  'Sub-Saharan Africa':   { center: [20, -5],   zoom: 2.5 },
  'Caribbean & Americas': { center: [-75, 15],  zoom: 3   },
};

export const REGION_LABEL_POSITIONS: Record<CulinaryRegion, [number, number]> = {
  'Western Europe':       [5, 50],
  'Eastern Europe':       [30, 52],
  'East Asia':            [110, 38],
  'Japan & Korea':        [137, 37],
  'Southeast Asia':       [112, 5],
  'South Asia':           [78, 22],
  'Middle East':          [48, 30],
  'North Africa':         [10, 28],
  'Sub-Saharan Africa':   [20, -5],
  'Caribbean & Americas': [-75, 10],
};
