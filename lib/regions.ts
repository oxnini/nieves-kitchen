import type { CulinaryRegion, SubCulinaryRegion } from './types';

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

/**
 * Sub-region taxonomy for the passport booklet.
 * Keyed by recipe.country (display name string), not numeric ISO code.
 */
export const COUNTRY_TO_SUBREGION: Record<string, SubCulinaryRegion> = {
  'Sweden': 'Northern Europe', 'Norway': 'Northern Europe', 'Denmark': 'Northern Europe',
  'Finland': 'Northern Europe', 'Iceland': 'Northern Europe',
  'France': 'Western Europe (sub)', 'Germany': 'Western Europe (sub)',
  'Netherlands': 'Western Europe (sub)', 'Belgium': 'Western Europe (sub)',
  'Austria': 'Western Europe (sub)', 'Switzerland': 'Western Europe (sub)',
  'Ireland': 'Western Europe (sub)', 'United Kingdom': 'Western Europe (sub)',
  'Luxembourg': 'Western Europe (sub)',
  'Italy': 'Mediterranean', 'Spain': 'Mediterranean', 'Portugal': 'Mediterranean',
  'Greece': 'Mediterranean', 'Malta': 'Mediterranean',
  'Poland': 'Eastern Europe (sub)', 'Czech Republic': 'Eastern Europe (sub)',
  'Hungary': 'Eastern Europe (sub)', 'Romania': 'Eastern Europe (sub)',
  'Bulgaria': 'Eastern Europe (sub)', 'Ukraine': 'Eastern Europe (sub)',
  'Russia': 'Eastern Europe (sub)', 'Slovakia': 'Eastern Europe (sub)',
  'Croatia': 'Eastern Europe (sub)', 'Serbia': 'Eastern Europe (sub)',
  'Bosnia and Herzegovina': 'Eastern Europe (sub)', 'Albania': 'Eastern Europe (sub)',
  'Slovenia': 'Eastern Europe (sub)', 'Belarus': 'Eastern Europe (sub)',
  'Lithuania': 'Eastern Europe (sub)', 'Latvia': 'Eastern Europe (sub)',
  'Estonia': 'Eastern Europe (sub)', 'Moldova': 'Eastern Europe (sub)',
  'China': 'East Asia (sub)', 'Mongolia': 'East Asia (sub)', 'Taiwan': 'East Asia (sub)',
  'Japan': 'Japan & Korea (sub)', 'South Korea': 'Japan & Korea (sub)',
  'North Korea': 'Japan & Korea (sub)',
  'Thailand': 'Southeast Asia (sub)', 'Vietnam': 'Southeast Asia (sub)',
  'Indonesia': 'Southeast Asia (sub)', 'Philippines': 'Southeast Asia (sub)',
  'Malaysia': 'Southeast Asia (sub)', 'Singapore': 'Southeast Asia (sub)',
  'Myanmar': 'Southeast Asia (sub)', 'Cambodia': 'Southeast Asia (sub)',
  'Laos': 'Southeast Asia (sub)',
  'India': 'South Asia (sub)', 'Pakistan': 'South Asia (sub)',
  'Bangladesh': 'South Asia (sub)', 'Sri Lanka': 'South Asia (sub)',
  'Nepal': 'South Asia (sub)', 'Bhutan': 'South Asia (sub)',
  'Afghanistan': 'South Asia (sub)',
  'Kazakhstan': 'Central Asia', 'Uzbekistan': 'Central Asia',
  'Turkmenistan': 'Central Asia', 'Kyrgyzstan': 'Central Asia',
  'Tajikistan': 'Central Asia',
  'Turkey': 'West Asia / Levant', 'Lebanon': 'West Asia / Levant',
  'Syria': 'West Asia / Levant', 'Israel': 'West Asia / Levant',
  'Palestine': 'West Asia / Levant', 'Jordan': 'West Asia / Levant',
  'Iran': 'West Asia / Levant', 'Iraq': 'West Asia / Levant',
  'Armenia': 'West Asia / Levant', 'Azerbaijan': 'West Asia / Levant',
  'Georgia': 'West Asia / Levant', 'Cyprus': 'West Asia / Levant',
  'Saudi Arabia': 'Arabian Peninsula', 'Yemen': 'Arabian Peninsula',
  'Oman': 'Arabian Peninsula', 'United Arab Emirates': 'Arabian Peninsula',
  'Qatar': 'Arabian Peninsula', 'Bahrain': 'Arabian Peninsula',
  'Kuwait': 'Arabian Peninsula',
  'Egypt': 'North Africa (sub)', 'Morocco': 'North Africa (sub)',
  'Tunisia': 'North Africa (sub)', 'Algeria': 'North Africa (sub)',
  'Libya': 'North Africa (sub)', 'Sudan': 'North Africa (sub)',
  'Nigeria': 'West Africa', 'Ghana': 'West Africa', 'Senegal': 'West Africa',
  'Mali': 'West Africa', 'Ivory Coast': 'West Africa', 'Guinea': 'West Africa',
  'Sierra Leone': 'West Africa', 'Liberia': 'West Africa', 'Burkina Faso': 'West Africa',
  'Benin': 'West Africa', 'Togo': 'West Africa', 'Mauritania': 'West Africa',
  'Gambia': 'West Africa', 'Cape Verde': 'West Africa', 'Niger': 'West Africa',
  'Ethiopia': 'East Africa', 'Kenya': 'East Africa', 'Tanzania': 'East Africa',
  'Uganda': 'East Africa', 'Rwanda': 'East Africa', 'Burundi': 'East Africa',
  'Somalia': 'East Africa', 'Eritrea': 'East Africa', 'Djibouti': 'East Africa',
  'South Sudan': 'East Africa', 'Madagascar': 'East Africa',
  'Democratic Republic of the Congo': 'Central Africa',
  'Republic of the Congo': 'Central Africa', 'Cameroon': 'Central Africa',
  'Gabon': 'Central Africa', 'Chad': 'Central Africa',
  'Central African Republic': 'Central Africa', 'Angola': 'Central Africa',
  'South Africa': 'Southern Africa', 'Zimbabwe': 'Southern Africa',
  'Zambia': 'Southern Africa', 'Mozambique': 'Southern Africa',
  'Botswana': 'Southern Africa', 'Namibia': 'Southern Africa',
  'Malawi': 'Southern Africa', 'Lesotho': 'Southern Africa',
  'Eswatini': 'Southern Africa',
  'United States of America': 'North America', 'USA': 'North America',
  'Canada': 'North America', 'Mexico': 'North America',
  'Guatemala': 'Central America & Caribbean', 'Belize': 'Central America & Caribbean',
  'Honduras': 'Central America & Caribbean', 'El Salvador': 'Central America & Caribbean',
  'Nicaragua': 'Central America & Caribbean', 'Costa Rica': 'Central America & Caribbean',
  'Panama': 'Central America & Caribbean', 'Cuba': 'Central America & Caribbean',
  'Jamaica': 'Central America & Caribbean', 'Haiti': 'Central America & Caribbean',
  'Dominican Republic': 'Central America & Caribbean',
  'Puerto Rico': 'Central America & Caribbean',
  'Trinidad and Tobago': 'Central America & Caribbean',
  'Bahamas': 'Central America & Caribbean', 'Barbados': 'Central America & Caribbean',
  'Brazil': 'South America', 'Argentina': 'South America', 'Chile': 'South America',
  'Peru': 'South America', 'Colombia': 'South America', 'Venezuela': 'South America',
  'Ecuador': 'South America', 'Bolivia': 'South America', 'Paraguay': 'South America',
  'Uruguay': 'South America', 'Guyana': 'South America', 'Suriname': 'South America',
  'Australia': 'Oceania', 'New Zealand': 'Oceania', 'Fiji': 'Oceania',
  'Papua New Guinea': 'Oceania', 'Samoa': 'Oceania', 'Tonga': 'Oceania',
};

export const SUB_REGION_PARENT: Record<SubCulinaryRegion, CulinaryRegion> = {
  'Northern Europe':              'Western Europe',
  'Western Europe (sub)':         'Western Europe',
  'Mediterranean':                'Western Europe',
  'Eastern Europe (sub)':         'Eastern Europe',
  'East Asia (sub)':              'East Asia',
  'Japan & Korea (sub)':          'Japan & Korea',
  'Southeast Asia (sub)':         'Southeast Asia',
  'South Asia (sub)':             'South Asia',
  'Central Asia':                 'South Asia',
  'West Asia / Levant':           'Middle East',
  'Arabian Peninsula':            'Middle East',
  'North Africa (sub)':           'North Africa',
  'West Africa':                  'Sub-Saharan Africa',
  'East Africa':                  'Sub-Saharan Africa',
  'Central Africa':               'Sub-Saharan Africa',
  'Southern Africa':              'Sub-Saharan Africa',
  'North America':                'Caribbean & Americas',
  'Central America & Caribbean':  'Caribbean & Americas',
  'South America':                'Caribbean & Americas',
  'Oceania':                      'Caribbean & Americas',
};

export const SUB_REGION_ORDER: SubCulinaryRegion[] = [
  'North America',
  'Central America & Caribbean',
  'South America',
  'Northern Europe',
  'Western Europe (sub)',
  'Mediterranean',
  'Eastern Europe (sub)',
  'North Africa (sub)',
  'West Africa',
  'Central Africa',
  'East Africa',
  'Southern Africa',
  'West Asia / Levant',
  'Arabian Peninsula',
  'Central Asia',
  'South Asia (sub)',
  'Southeast Asia (sub)',
  'East Asia (sub)',
  'Japan & Korea (sub)',
  'Oceania',
];

export const SUB_REGION_SLUG: Record<SubCulinaryRegion, string> = {
  'Northern Europe':              'northern-europe',
  'Western Europe (sub)':         'western-europe',
  'Mediterranean':                'mediterranean',
  'Eastern Europe (sub)':         'eastern-europe',
  'East Asia (sub)':              'east-asia',
  'Japan & Korea (sub)':          'japan-korea',
  'Southeast Asia (sub)':         'southeast-asia',
  'South Asia (sub)':             'south-asia',
  'Central Asia':                 'central-asia',
  'West Asia / Levant':           'west-asia-levant',
  'Arabian Peninsula':            'arabian-peninsula',
  'North Africa (sub)':           'north-africa',
  'West Africa':                  'west-africa',
  'East Africa':                  'east-africa',
  'Central Africa':               'central-africa',
  'Southern Africa':              'southern-africa',
  'North America':                'north-america',
  'Central America & Caribbean':  'central-america-caribbean',
  'South America':                'south-america',
  'Oceania':                      'oceania',
};

export const SLUG_TO_SUB_REGION: Record<string, SubCulinaryRegion> =
  Object.fromEntries(
    Object.entries(SUB_REGION_SLUG).map(([k, v]) => [v, k as SubCulinaryRegion]),
  );
