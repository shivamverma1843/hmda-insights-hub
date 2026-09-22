// Extended HMDA market dataset for 2017–2025 business questions.
// Includes national, state, MSA, manufactured-home, denial-rate, and forecast data.
// Figures are illustrative aggregates reflecting public HMDA reporting trends.

export const FULL_YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// National site-built, owner-occupied, single-family home-purchase loans
export const nationalAnnual = [
  { year: 2017, originations: 6_000_000, medianProperty: 340_000, denialRate: 10.8, medianRate: 3.99 },
  { year: 2018, originations: 6_100_000, medianProperty: 352_000, denialRate: 11.2, medianRate: 4.54 },
  { year: 2019, originations: 5_500_000, medianProperty: 360_000, denialRate: 9.6, medianRate: 4.05 },
  { year: 2020, originations: 8_200_000, medianProperty: 375_000, denialRate: 8.2, medianRate: 3.11 },
  { year: 2021, originations: 9_900_000, medianProperty: 405_000, denialRate: 7.4, medianRate: 3.02 },
  { year: 2022, originations: 4_100_000, medianProperty: 430_000, denialRate: 11.8, medianRate: 5.34 },
  { year: 2023, originations: 3_200_000, medianProperty: 438_000, denialRate: 13.1, medianRate: 6.84 },
  { year: 2024, originations: 3_900_000, medianProperty: 445_000, denialRate: 11.9, medianRate: 6.86 },
  { year: 2025, originations: 4_600_000, medianProperty: 455_000, denialRate: 10.4, medianRate: 6.42 },
];

// Manufactured home median property value (national)
export const manufacturedAnnual = [
  { year: 2017, medianProperty: 85_000 },
  { year: 2018, medianProperty: 88_000 },
  { year: 2019, medianProperty: 92_000 },
  { year: 2020, medianProperty: 96_000 },
  { year: 2021, medianProperty: 102_000 },
  { year: 2022, medianProperty: 112_000 },
  { year: 2023, medianProperty: 118_000 },
  { year: 2024, medianProperty: 122_000 },
  { year: 2025, medianProperty: 126_000 },
];

// State raw definitions: base 2017 median value + 8 annual growth rates (2018..2025)
const STATES_RAW = [
  { code: "CA", name: "California", base: 510_000, g: [0.05, 0.04, 0.06, 0.11, 0.09, 0.01, 0.02, 0.03], region: "West", denialBase: 11.5 },
  { code: "TX", name: "Texas", base: 235_000, g: [0.06, 0.04, 0.07, 0.14, 0.12, 0.05, 0.04, 0.04], region: "South", denialBase: 11.0 },
  { code: "FL", name: "Florida", base: 245_000, g: [0.05, 0.03, 0.08, 0.15, 0.13, 0.06, 0.05, 0.05], region: "South", denialBase: 12.2 },
  { code: "NY", name: "New York", base: 360_000, g: [0.03, 0.02, 0.04, 0.08, 0.07, 0.01, 0.01, 0.02], region: "Northeast", denialBase: 10.4 },
  { code: "WA", name: "Washington", base: 385_000, g: [0.07, 0.05, 0.09, 0.13, 0.11, 0.03, 0.03, 0.04], region: "West", denialBase: 9.8 },
  { code: "CO", name: "Colorado", base: 370_000, g: [0.06, 0.04, 0.08, 0.14, 0.12, 0.03, 0.03, 0.04], region: "West", denialBase: 9.5 },
  { code: "AZ", name: "Arizona", base: 260_000, g: [0.06, 0.04, 0.09, 0.16, 0.13, 0.05, 0.04, 0.05], region: "West", denialBase: 11.8 },
  { code: "NV", name: "Nevada", base: 280_000, g: [0.07, 0.05, 0.1, 0.17, 0.14, 0.04, 0.04, 0.05], region: "West", denialBase: 12.5 },
  { code: "OR", name: "Oregon", base: 330_000, g: [0.06, 0.04, 0.08, 0.13, 0.11, 0.02, 0.02, 0.03], region: "West", denialBase: 10.1 },
  { code: "UT", name: "Utah", base: 305_000, g: [0.08, 0.06, 0.1, 0.18, 0.15, 0.04, 0.04, 0.05], region: "West", denialBase: 9.2 },
  { code: "ID", name: "Idaho", base: 240_000, g: [0.09, 0.07, 0.12, 0.2, 0.16, 0.05, 0.05, 0.06], region: "West", denialBase: 9.0 },
  { code: "NC", name: "North Carolina", base: 215_000, g: [0.05, 0.04, 0.07, 0.12, 0.1, 0.04, 0.04, 0.04], region: "South", denialBase: 11.2 },
  { code: "SC", name: "South Carolina", base: 205_000, g: [0.05, 0.04, 0.07, 0.12, 0.1, 0.04, 0.04, 0.04], region: "South", denialBase: 11.5 },
  { code: "GA", name: "Georgia", base: 225_000, g: [0.05, 0.04, 0.07, 0.13, 0.11, 0.04, 0.04, 0.04], region: "South", denialBase: 12.0 },
  { code: "TN", name: "Tennessee", base: 210_000, g: [0.06, 0.04, 0.08, 0.13, 0.11, 0.04, 0.04, 0.04], region: "South", denialBase: 11.0 },
  { code: "MI", name: "Michigan", base: 175_000, g: [0.04, 0.03, 0.06, 0.1, 0.09, 0.03, 0.03, 0.03], region: "Midwest", denialBase: 10.8 },
  { code: "OH", name: "Ohio", base: 165_000, g: [0.03, 0.02, 0.05, 0.09, 0.08, 0.02, 0.02, 0.03], region: "Midwest", denialBase: 10.5 },
  { code: "PA", name: "Pennsylvania", base: 185_000, g: [0.03, 0.02, 0.04, 0.08, 0.07, 0.02, 0.02, 0.02], region: "Northeast", denialBase: 10.2 },
  { code: "IL", name: "Illinois", base: 205_000, g: [0.02, 0.01, 0.04, 0.08, 0.07, 0.01, 0.01, 0.02], region: "Midwest", denialBase: 10.9 },
  { code: "MA", name: "Massachusetts", base: 380_000, g: [0.04, 0.03, 0.05, 0.09, 0.08, 0.02, 0.02, 0.03], region: "Northeast", denialBase: 9.6 },
  { code: "NJ", name: "New Jersey", base: 335_000, g: [0.03, 0.02, 0.04, 0.08, 0.07, 0.01, 0.01, 0.02], region: "Northeast", denialBase: 10.3 },
  { code: "VA", name: "Virginia", base: 285_000, g: [0.04, 0.03, 0.05, 0.1, 0.09, 0.03, 0.03, 0.03], region: "South", denialBase: 10.0 },
  { code: "MN", name: "Minnesota", base: 245_000, g: [0.04, 0.03, 0.05, 0.1, 0.09, 0.02, 0.02, 0.03], region: "Midwest", denialBase: 9.9 },
  { code: "MD", name: "Maryland", base: 300_000, g: [0.03, 0.02, 0.04, 0.08, 0.07, 0.02, 0.02, 0.02], region: "South", denialBase: 10.1 },
];

function buildSeries(base, growthRates) {
  const vals = { 2017: base };
  for (let i = 1; i < FULL_YEARS.length; i++) {
    vals[FULL_YEARS[i]] = Math.round(vals[FULL_YEARS[i - 1]] * (1 + growthRates[i - 1]));
  }
  return vals;
}

function cagr(start, end, years) {
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

// Denial rate per state per year (around denialBase with a national-style cycle)
function buildDenial(denialBase) {
  const cycle = [0, 0.4, -1.2, -3.0, -3.8, 1.0, 2.3, 1.1, -0.4];
  const vals = {};
  FULL_YEARS.forEach((y, i) => {
    vals[y] = +(denialBase + cycle[i]).toFixed(1);
  });
  return vals;
}

export const STATES = STATES_RAW.map((s) => {
  const values = buildSeries(s.base, s.g);
  return {
    code: s.code,
    name: s.name,
    region: s.region,
    values,
    cagr: +cagr(s.base, values[2025], 8).toFixed(2),
    denial: buildDenial(s.denialBase),
    originations: Math.round(s.base * 0.02 + 20000),
  };
}).sort((a, b) => b.cagr - a.cagr);

// MSA definitions
const MSAS_RAW = [
  { name: "Austin-Round Rock", state: "TX", base: 320_000, g: [0.08, 0.06, 0.11, 0.2, 0.16, 0.05, 0.04, 0.05] },
  { name: "Boise City", state: "ID", base: 265_000, g: [0.1, 0.08, 0.13, 0.24, 0.18, 0.05, 0.05, 0.06] },
  { name: "Phoenix-Mesa-Chandler", state: "AZ", base: 270_000, g: [0.07, 0.05, 0.1, 0.2, 0.16, 0.05, 0.04, 0.05] },
  { name: "Salt Lake City", state: "UT", base: 330_000, g: [0.09, 0.07, 0.11, 0.19, 0.15, 0.04, 0.04, 0.05] },
  { name: "Nashville-Davidson", state: "TN", base: 245_000, g: [0.07, 0.05, 0.09, 0.16, 0.13, 0.04, 0.04, 0.04] },
  { name: "Charlotte-Concord", state: "NC", base: 235_000, g: [0.06, 0.05, 0.08, 0.15, 0.12, 0.04, 0.04, 0.04] },
  { name: "Raleigh", state: "NC", base: 250_000, g: [0.06, 0.05, 0.08, 0.15, 0.12, 0.04, 0.04, 0.04] },
  { name: "Las Vegas-Henderson", state: "NV", base: 295_000, g: [0.08, 0.06, 0.11, 0.19, 0.15, 0.04, 0.04, 0.05] },
  { name: "Dallas-Fort Worth", state: "TX", base: 250_000, g: [0.06, 0.04, 0.08, 0.15, 0.12, 0.04, 0.04, 0.04] },
  { name: "Denver-Aurora", state: "CO", base: 400_000, g: [0.07, 0.05, 0.09, 0.15, 0.12, 0.03, 0.03, 0.04] },
  { name: "Seattle-Tacoma", state: "WA", base: 430_000, g: [0.08, 0.06, 0.1, 0.15, 0.12, 0.03, 0.03, 0.04] },
  { name: "Atlanta-Sandy Springs", state: "GA", base: 240_000, g: [0.05, 0.04, 0.07, 0.14, 0.11, 0.04, 0.04, 0.04] },
  { name: "Orlando-Kissimmee", state: "FL", base: 255_000, g: [0.06, 0.04, 0.09, 0.16, 0.13, 0.05, 0.04, 0.05] },
  { name: "Tampa-St. Petersburg", state: "FL", base: 240_000, g: [0.05, 0.04, 0.08, 0.15, 0.12, 0.05, 0.04, 0.04] },
  { name: "Sacramento-Roseville", state: "CA", base: 375_000, g: [0.06, 0.04, 0.07, 0.12, 0.1, 0.03, 0.03, 0.04] },
];

export const MSAS = MSAS_RAW.map((m) => {
  const values = buildSeries(m.base, m.g);
  return {
    name: m.name,
    state: m.state,
    values,
    cagr: +cagr(m.base, values[2025], 8).toFixed(2),
  };
}).sort((a, b) => b.cagr - a.cagr);

// Linear regression forecast
export function linreg(points) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

export const FORECAST_YEARS = [2026, 2027, 2028];

export function forecastValues(valuesByYear) {
  const pts = FULL_YEARS.map((y) => ({ x: y, y: valuesByYear[y] }));
  const { slope, intercept } = linreg(pts);
  return FORECAST_YEARS.map((y) => ({ year: y, value: Math.round(slope * y + intercept) }));
}

// Helpers
export const fmtUSD = (n) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
};
export const fmtNum = (n) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${n}`;
};
export const fmtPct = (n) => `${n.toFixed(1)}%`;