// Kalandra National Statistics Office — published figures, 2015–2025.
// Every series below is an invented dataset for the fictional Republic of
// Kalandra, written for this site. Each table names the KNSO publication
// it comes from and the year that publication covers.

export const META = {
  country: 'Republic of Kalandra',
  office: 'Kalandra National Statistics Office',
  short: 'KNSO',
  capital: 'Port Meridia',
  currency: 'KLR',
  currencyName: 'Kalandran lek',
  updated: '12 February 2026',
  nextRelease: 'Consumer Price Index, February 2026 — 10 March 2026',
};

// Annual headline series, 2015–2025.
export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const SERIES = {
  population: {
    label: 'Population',
    unit: 'million people',
    source: 'KNSO, Annual Population Estimates 2025',
    values: [8.42, 8.55, 8.69, 8.84, 8.99, 9.12, 9.28, 9.44, 9.58, 9.73, 9.87],
  },
  gdp: {
    label: 'Gross domestic product',
    unit: 'KLR billion, current prices',
    source: 'KNSO, National Accounts 2025',
    values: [412.6, 428.9, 449.3, 471.8, 495.2, 478.4, 512.7, 548.9, 583.1, 621.4, 664.8],
  },
  gdpGrowth: {
    label: 'Real GDP growth',
    unit: 'percent per year',
    source: 'KNSO, National Accounts 2025',
    values: [2.9, 3.9, 4.8, 5.0, 4.9, -3.4, 7.2, 7.1, 6.2, 6.6, 7.0],
  },
  unemployment: {
    label: 'Unemployment rate',
    unit: 'percent of labour force',
    source: 'KNSO, Labour Force Survey 2025',
    values: [7.8, 7.4, 7.0, 6.6, 6.3, 8.9, 7.6, 6.9, 6.2, 5.8, 5.4],
  },
  participation: {
    label: 'Labour force participation',
    unit: 'percent of population aged 15–64',
    source: 'KNSO, Labour Force Survey 2025',
    values: [63.1, 63.4, 63.8, 64.2, 64.6, 63.9, 64.8, 65.3, 65.7, 66.1, 66.4],
  },
  cpi: {
    label: 'Consumer price index',
    unit: 'index, 2015 = 100',
    source: 'KNSO, Consumer Price Index, January 2026',
    values: [100.0, 101.8, 104.1, 106.9, 109.8, 111.2, 115.6, 121.9, 127.4, 131.8, 135.9],
  },
  inflation: {
    label: 'Annual inflation',
    unit: 'percent change in CPI',
    source: 'KNSO, Consumer Price Index, January 2026',
    values: [null, 1.8, 2.3, 2.7, 2.7, 1.3, 4.0, 5.4, 4.5, 3.5, 3.1],
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    source: 'KNSO, Vital Statistics 2025',
    values: [76.4, 76.6, 76.8, 77.0, 77.2, 77.0, 77.4, 77.7, 78.0, 78.2, 78.5],
  },
  medianWage: {
    label: 'Median monthly wage',
    unit: 'KLR, gross',
    source: 'KNSO, Earnings Survey 2025',
    values: [2840, 2930, 3050, 3180, 3320, 3290, 3480, 3720, 3940, 4180, 4450],
  },
};

// The eight regions of Kalandra, 2025. Population in millions; area in km²;
// GDP per person in KLR; unemployment and urban share in percent.
export const REGIONS = [
  { slug: 'port-meridia', name: 'Port Meridia', capital: 'Port Meridia City', population: 2.41, area: 1240, gdpPerPerson: 84200, unemployment: 4.1, urban: 96, source: 'KNSO, Regional GDP 2024 and Population Estimates 2025' },
  { slug: 'northgate', name: 'Northgate', capital: 'Kestrel', population: 1.52, area: 18900, gdpPerPerson: 58400, unemployment: 5.9, urban: 71, source: 'KNSO, Regional GDP 2024 and Population Estimates 2025' },
  { slug: 'aldervale', name: 'Aldervale', capital: 'Alderton', population: 1.18, area: 24300, gdpPerPerson: 52700, unemployment: 6.2, urban: 58, source: 'KNSO, Regional GDP 2024 and Population Estimates 2025' },
  { slug: 'tarnwick', name: 'Tarnwick', capital: 'Tarnwick Town', population: 0.96, area: 31700, gdpPerPerson: 44900, unemployment: 7.4, urban: 49, source: 'KNSO, Regional GDP 2024 and Population Estimates 2025' },
  { slug: 'sable-coast', name: 'Sable Coast', capital: 'Marisol', population: 1.05, area: 9800, gdpPerPerson: 61300, unemployment: 5.1, urban: 78, source: 'KNSO, Regional GDP 2024 and Population Estimates 2025' },
  { slug: 'highmoor', name: 'Highmoor', capital: 'Dunfell', population: 0.74, area: 42600, gdpPerPerson: 38200, unemployment: 8.3, urban: 34, source: 'KNSO, Regional GDP 2024 and Population Estimates 2025' },
  { slug: 'riverbend', name: 'Riverbend', capital: 'Corra', population: 1.31, area: 15400, gdpPerPerson: 55800, unemployment: 5.6, urban: 66, source: 'KNSO, Regional GDP 2024 and Population Estimates 2025' },
  { slug: 'isla-verde', name: 'Isla Verde', capital: 'Verde Harbour', population: 0.70, area: 6100, gdpPerPerson: 47600, unemployment: 6.8, urban: 61, source: 'KNSO, Regional GDP 2024 and Population Estimates 2025' },
];

// Population by age group, 2025, percent of total population.
export const AGE_GROUPS = [
  { group: '0–14 years', share: 18.4, source: 'KNSO, Population Estimates 2025' },
  { group: '15–24 years', share: 13.2, source: 'KNSO, Population Estimates 2025' },
  { group: '25–54 years', share: 43.1, source: 'KNSO, Population Estimates 2025' },
  { group: '55–64 years', share: 12.6, source: 'KNSO, Population Estimates 2025' },
  { group: '65 years and over', share: 12.7, source: 'KNSO, Population Estimates 2025' },
];

// Gross value added by industry, 2025, percent of total GVA.
export const GDP_SECTORS = [
  { sector: 'Services', share: 58.2, source: 'KNSO, National Accounts 2025' },
  { sector: 'Industry', share: 24.6, source: 'KNSO, National Accounts 2025' },
  { sector: 'Construction', share: 7.1, source: 'KNSO, National Accounts 2025' },
  { sector: 'Agriculture, forestry and fishing', share: 6.8, source: 'KNSO, National Accounts 2025' },
  { sector: 'Other', share: 3.3, source: 'KNSO, National Accounts 2025' },
];

// Employment by industry, 2025, percent of all people in work.
export const EMPLOYMENT_SECTORS = [
  { sector: 'Services', share: 64.3, source: 'KNSO, Labour Force Survey 2025' },
  { sector: 'Industry', share: 18.9, source: 'KNSO, Labour Force Survey 2025' },
  { sector: 'Agriculture, forestry and fishing', share: 8.4, source: 'KNSO, Labour Force Survey 2025' },
  { sector: 'Construction', share: 6.1, source: 'KNSO, Labour Force Survey 2025' },
  { sector: 'Other', share: 2.3, source: 'KNSO, Labour Force Survey 2025' },
];

// CPI basket: weight in the basket and annual price change, January 2026.
export const CPI_COMPONENTS = [
  { component: 'Food and non-alcoholic drinks', weight: 24.1, change: 3.8, source: 'KNSO, Consumer Price Index, January 2026' },
  { component: 'Housing, water and utilities', weight: 27.6, change: 2.9, source: 'KNSO, Consumer Price Index, January 2026' },
  { component: 'Transport', weight: 12.4, change: 2.2, source: 'KNSO, Consumer Price Index, January 2026' },
  { component: 'Energy', weight: 6.8, change: 4.6, source: 'KNSO, Consumer Price Index, January 2026' },
  { component: 'Health', weight: 5.2, change: 2.4, source: 'KNSO, Consumer Price Index, January 2026' },
  { component: 'Education', weight: 4.9, change: 3.1, source: 'KNSO, Consumer Price Index, January 2026' },
  { component: 'Recreation, culture and other', weight: 19.0, change: 2.7, source: 'KNSO, Consumer Price Index, January 2026' },
];

// Trade in goods, KLR billion.
export const TRADE_YEARS = [2021, 2022, 2023, 2024, 2025];
export const TRADE = {
  exports: { label: 'Exports', values: [96.4, 108.2, 117.6, 126.9, 138.4], source: 'KNSO, Trade in Goods, December 2025' },
  imports: { label: 'Imports', values: [101.8, 112.5, 118.9, 124.3, 132.1], source: 'KNSO, Trade in Goods, December 2025' },
  balance: { label: 'Trade balance', values: [-5.4, -4.3, -1.3, 2.6, 6.3], source: 'KNSO, Trade in Goods, December 2025' },
};

// Main export destinations, 2025, KLR billion of exports.
export const TRADE_PARTNERS = [
  { partner: 'Altan Republic', exports: 25.2, source: 'KNSO, Trade in Goods, December 2025' },
  { partner: 'Vostok Federation', exports: 17.6, source: 'KNSO, Trade in Goods, December 2025' },
  { partner: 'Meridian Union', exports: 15.8, source: 'KNSO, Trade in Goods, December 2025' },
  { partner: 'Coral Isles', exports: 11.9, source: 'KNSO, Trade in Goods, December 2025' },
  { partner: 'Nordhavn', exports: 9.4, source: 'KNSO, Trade in Goods, December 2025' },
];

// Latest releases, newest first.
export const RELEASES = [
  { title: 'Labour Force Survey, Q4 2025', date: '12 February 2026', route: '#/labour', source: 'KNSO, Labour Force Survey 2025' },
  { title: 'Consumer Price Index, January 2026', date: '10 February 2026', route: '#/prices', source: 'KNSO, Consumer Price Index, January 2026' },
  { title: 'National Accounts, Q4 2025', date: '28 January 2026', route: '#/economy', source: 'KNSO, National Accounts 2025' },
  { title: 'Trade in Goods, December 2025', date: '21 January 2026', route: '#/economy', source: 'KNSO, Trade in Goods, December 2025' },
  { title: 'Population Estimates, mid-2025', date: '15 January 2026', route: '#/population', source: 'KNSO, Annual Population Estimates 2025' },
  { title: 'Regional GDP, 2024', date: '18 December 2025', route: '#/regions', source: 'KNSO, Regional GDP 2024' },
];

// Forthcoming releases.
export const RELEASE_CALENDAR = [
  { title: 'Consumer Price Index, February 2026', date: '10 March 2026' },
  { title: 'Labour Force Survey, Q1 2026', date: '14 May 2026' },
  { title: 'National Accounts, Q1 2026', date: '29 April 2026' },
  { title: 'Population Estimates, mid-2026', date: '16 July 2026' },
  { title: 'Regional GDP, 2025', date: '17 December 2026' },
  { title: 'Earnings Survey, 2026', date: '22 September 2026' },
];

// Headline indicators shown on the home page: value, previous-year value,
// the series they come from and how to format the change.
export function headlineIndicators() {
  const last = YEARS.length - 1;
  const prev = last - 1;
  const pick = (key, format) => {
    const s = SERIES[key];
    return { label: s.label, value: format(s.values[last]), change: s.values[last] - s.values[prev], source: s.source, unit: s.unit };
  };
  return [
    pick('population', (v) => v.toFixed(2) + ' m'),
    pick('gdp', (v) => 'KLR ' + v.toFixed(1) + ' bn'),
    pick('unemployment', (v) => v.toFixed(1) + '%'),
    pick('inflation', (v) => v.toFixed(1) + '%'),
  ];
}
