import type { CulinaryRegion } from "../types";

// Choropleth coloring
export const CHOROPLETH_BASE = { r: 160, g: 90, b: 60 }; // warm dark brown base
export const CHOROPLETH_LIGHT = "#E3D4C4"; // regions with no recipes (warm tint)
export const CHOROPLETH_EMPTY = "#ECE5DB"; // countries not in any region (neutral)

// Maps numeric ISO country codes (used by world-atlas) to culinary regions
export const COUNTRY_TO_REGION: Record<string, CulinaryRegion> = {
  // Western Europe
  "724": "Western Europe", // Spain
  "380": "Western Europe", // Italy
  "250": "Western Europe", // France
  "276": "Western Europe", // Germany
  "826": "Western Europe", // United Kingdom
  "620": "Western Europe", // Portugal
  "528": "Western Europe", // Netherlands
  "056": "Western Europe", // Belgium
  "756": "Western Europe", // Switzerland
  "040": "Western Europe", // Austria
  "372": "Western Europe", // Ireland
  "442": "Western Europe", // Luxembourg
  "208": "Western Europe", // Denmark
  "578": "Western Europe", // Norway
  "752": "Western Europe", // Sweden
  "246": "Western Europe", // Finland
  "352": "Western Europe", // Iceland

  // Eastern Europe
  "300": "Eastern Europe", // Greece
  "616": "Eastern Europe", // Poland
  "203": "Eastern Europe", // Czechia
  "348": "Eastern Europe", // Hungary
  "642": "Eastern Europe", // Romania
  "100": "Eastern Europe", // Bulgaria
  "688": "Eastern Europe", // Serbia
  "191": "Eastern Europe", // Croatia
  "705": "Eastern Europe", // Slovenia
  "703": "Eastern Europe", // Slovakia
  "804": "Eastern Europe", // Ukraine
  "112": "Eastern Europe", // Belarus
  "498": "Eastern Europe", // Moldova
  "070": "Eastern Europe", // Bosnia and Herz.
  "499": "Eastern Europe", // Montenegro
  "008": "Eastern Europe", // Albania
  "807": "Eastern Europe", // Macedonia
  "643": "Eastern Europe", // Russia
  "440": "Eastern Europe", // Lithuania
  "428": "Eastern Europe", // Latvia
  "233": "Eastern Europe", // Estonia
  "268": "Eastern Europe", // Georgia
  "051": "Eastern Europe", // Armenia
  "031": "Eastern Europe", // Azerbaijan

  // East Asia
  "156": "East Asia", // China
  "158": "East Asia", // Taiwan
  "496": "East Asia", // Mongolia

  // Japan & Korea
  "392": "Japan & Korea", // Japan
  "410": "Japan & Korea", // South Korea
  "408": "Japan & Korea", // North Korea

  // Southeast Asia
  "764": "Southeast Asia", // Thailand
  "704": "Southeast Asia", // Vietnam
  "458": "Southeast Asia", // Malaysia
  "360": "Southeast Asia", // Indonesia
  "608": "Southeast Asia", // Philippines
  "104": "Southeast Asia", // Myanmar
  "116": "Southeast Asia", // Cambodia
  "418": "Southeast Asia", // Laos
  "096": "Southeast Asia", // Brunei

  // South Asia
  "356": "South Asia", // India
  "586": "South Asia", // Pakistan
  "050": "South Asia", // Bangladesh
  "144": "South Asia", // Sri Lanka
  "524": "South Asia", // Nepal
  "064": "South Asia", // Bhutan
  "004": "South Asia", // Afghanistan

  // Middle East
  "792": "Middle East", // Turkey
  "422": "Middle East", // Lebanon
  "760": "Middle East", // Syria
  "400": "Middle East", // Jordan
  "368": "Middle East", // Iraq
  "364": "Middle East", // Iran
  "682": "Middle East", // Saudi Arabia
  "784": "Middle East", // UAE
  "634": "Middle East", // Qatar
  "414": "Middle East", // Kuwait
  "512": "Middle East", // Oman
  "887": "Middle East", // Yemen
  "376": "Middle East", // Israel
  "275": "Middle East", // Palestine
  "196": "Middle East", // Cyprus

  // North Africa
  "504": "North Africa", // Morocco
  "012": "North Africa", // Algeria
  "788": "North Africa", // Tunisia
  "434": "North Africa", // Libya
  "818": "North Africa", // Egypt
  "729": "North Africa", // Sudan
  "478": "North Africa", // Mauritania

  // Sub-Saharan Africa
  "566": "Sub-Saharan Africa", // Nigeria
  "404": "Sub-Saharan Africa", // Kenya
  "231": "Sub-Saharan Africa", // Ethiopia
  "288": "Sub-Saharan Africa", // Ghana
  "710": "Sub-Saharan Africa", // South Africa
  "834": "Sub-Saharan Africa", // Tanzania
  "800": "Sub-Saharan Africa", // Uganda
  "120": "Sub-Saharan Africa", // Cameroon
  "686": "Sub-Saharan Africa", // Senegal
  "384": "Sub-Saharan Africa", // Côte d'Ivoire
  "508": "Sub-Saharan Africa", // Mozambique
  "450": "Sub-Saharan Africa", // Madagascar
  "024": "Sub-Saharan Africa", // Angola
  "894": "Sub-Saharan Africa", // Zambia
  "716": "Sub-Saharan Africa", // Zimbabwe
  "454": "Sub-Saharan Africa", // Malawi
  "466": "Sub-Saharan Africa", // Mali
  "854": "Sub-Saharan Africa", // Burkina Faso
  "562": "Sub-Saharan Africa", // Niger
  "148": "Sub-Saharan Africa", // Chad
  "180": "Sub-Saharan Africa", // Dem. Rep. Congo
  "178": "Sub-Saharan Africa", // Congo
  "266": "Sub-Saharan Africa", // Gabon
  "226": "Sub-Saharan Africa", // Eq. Guinea
  "694": "Sub-Saharan Africa", // Sierra Leone
  "430": "Sub-Saharan Africa", // Liberia
  "324": "Sub-Saharan Africa", // Guinea
  "768": "Sub-Saharan Africa", // Togo
  "204": "Sub-Saharan Africa", // Benin
  "072": "Sub-Saharan Africa", // Botswana
  "516": "Sub-Saharan Africa", // Namibia
  "748": "Sub-Saharan Africa", // eSwatini
  "426": "Sub-Saharan Africa", // Lesotho
  "646": "Sub-Saharan Africa", // Rwanda
  "108": "Sub-Saharan Africa", // Burundi
  "706": "Sub-Saharan Africa", // Somalia
  "232": "Sub-Saharan Africa", // Eritrea
  "262": "Sub-Saharan Africa", // Djibouti
  "140": "Sub-Saharan Africa", // Central African Rep.
  "728": "Sub-Saharan Africa", // S. Sudan

  // Caribbean & Americas
  "840": "Caribbean & Americas", // USA
  "124": "Caribbean & Americas", // Canada
  "484": "Caribbean & Americas", // Mexico
  "076": "Caribbean & Americas", // Brazil
  "032": "Caribbean & Americas", // Argentina
  "170": "Caribbean & Americas", // Colombia
  "604": "Caribbean & Americas", // Peru
  "152": "Caribbean & Americas", // Chile
  "862": "Caribbean & Americas", // Venezuela
  "218": "Caribbean & Americas", // Ecuador
  "068": "Caribbean & Americas", // Bolivia
  "600": "Caribbean & Americas", // Paraguay
  "858": "Caribbean & Americas", // Uruguay
  "328": "Caribbean & Americas", // Guyana
  "740": "Caribbean & Americas", // Suriname
  "192": "Caribbean & Americas", // Cuba
  "388": "Caribbean & Americas", // Jamaica
  "332": "Caribbean & Americas", // Haiti
  "214": "Caribbean & Americas", // Dominican Rep.
  "780": "Caribbean & Americas", // Trinidad and Tobago
  "591": "Caribbean & Americas", // Panama
  "188": "Caribbean & Americas", // Costa Rica
  "320": "Caribbean & Americas", // Guatemala
  "340": "Caribbean & Americas", // Honduras
  "222": "Caribbean & Americas", // El Salvador
  "558": "Caribbean & Americas", // Nicaragua
  "084": "Caribbean & Americas", // Belize
};

// Center coordinates for zooming into each region
export const REGION_CENTERS: Record<CulinaryRegion, { center: [number, number]; zoom: number }> = {
  "Western Europe":       { center: [5, 48],    zoom: 4 },
  "Eastern Europe":       { center: [25, 50],   zoom: 3.5 },
  "East Asia":            { center: [105, 35],  zoom: 3.5 },
  "Japan & Korea":        { center: [135, 37],  zoom: 4.5 },
  "Southeast Asia":       { center: [110, 5],   zoom: 3.5 },
  "South Asia":           { center: [78, 22],   zoom: 3.5 },
  "Middle East":          { center: [45, 30],   zoom: 3.5 },
  "North Africa":         { center: [10, 30],   zoom: 3.5 },
  "Sub-Saharan Africa":   { center: [20, -5],   zoom: 2.5 },
  "Caribbean & Americas": { center: [-75, 15],  zoom: 3 },
};

// Label positions for region beacons on the world map
export const REGION_LABEL_POSITIONS: Record<CulinaryRegion, [number, number]> = {
  "Western Europe":       [5, 50],
  "Eastern Europe":       [30, 52],
  "East Asia":            [110, 38],
  "Japan & Korea":        [137, 37],
  "Southeast Asia":       [112, 5],
  "South Asia":           [78, 22],
  "Middle East":          [48, 30],
  "North Africa":         [10, 28],
  "Sub-Saharan Africa":   [20, -5],
  "Caribbean & Americas": [-75, 10],
};
